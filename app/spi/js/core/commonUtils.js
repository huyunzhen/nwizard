/**
 * catch key down event
 */
function keydownevent(event) {
    //alert(top.root.footer.document.getElementById('nextButton').value);
    event = event || window.event;
    if (!event) {
        top.logMessage("null event!");
        return true;
    }
    top.logMessage("LPV20024W", String.fromCharCode(event.keyCode).toLowerCase());
    if (event.altKey && (String.fromCharCode(event.keyCode).toLowerCase() == 'n')) {
        event.cancelBubble = true;
        event.returnValue = false;
        if (event.stopPropagation) {
            event.stopPropagation();
            event.preventDefault();
        }
        //if (top.root.footer.document.getElementById('nextButton').disabled == false) {
        gl_wizard.steps("next");
        //}
        return false;
    }
    if (event.altKey && (String.fromCharCode(event.keyCode).toLowerCase() == 'p')) {
        event.cancelBubble = true;
        event.returnValue = false;
        if (event.stopPropagation) {
            event.stopPropagation();
            event.preventDefault();
        }
        //if (top.root.footer.document.getElementById('previousButton').disabled == false) {
        gl_wizard.steps("previous");
        //}
        return false;
    }
    if (event.altKey && (String.fromCharCode(event.keyCode).toLowerCase() == 'c')) {
        event.cancelBubble = true;
        event.returnValue = false;
        if (event.stopPropagation) {
            event.stopPropagation();
            event.preventDefault();
        }
        //if (top.root.footer.document.getElementById('cancelButton').disabled == false) {
        top.Exit(true);
        //}
        return false;
    }
    return true;
}
//***********************************************************************************
// Initialization
// Call mini_init first
//***********************************************************************************
function common_init() {
    
    mini_init();

    //It works well on Windows, but we can't get the correct proxy setting on Linux easily.
    if (top.gl_properties_info["PROXY_ENABLED"] == "YES") {
        top.gl_isProxy = true;
    } else {
        top.gl_isProxy = false;
    }

    if (top.gl_properties_info["PROXY_ADDRESS"] != "NULL" &&
        top.gl_properties_info["PROXY_PORT"] != "NULL") {
        top.gl_proxy_address = top.gl_properties_info["PROXY_ADDRESS"];
        top.gl_proxy_port = top.gl_properties_info["PROXY_PORT"];
    } else {
        top.gl_proxy_address = "";
        top.gl_proxy_port = "";
    }

    if (top.gl_properties_info["PROXY_USERNAME"] != "NULL") {
        top.gl_proxy_username = top.gl_properties_info["PROXY_USERNAME"];

        if (top.gl_properties_info["PROXY_PASSWORD"] != "NULL")
            top.gl_proxy_password = top.gl_properties_info["PROXY_PASSWORD"];
        else
            top.gl_proxy_password = "";
    } else {
        top.gl_proxy_username = "";
        top.gl_proxy_password = "";
    }

    //top.gl_proxyChecker = top.gl_mainAppName_dir + getOSCommand("proxyChecker");
    //top.gl_proxyTransfer = getOSCommand("proxyTransfer");

    try {
        var p_file = top.TOPDIR + getOSCommand("blacklist_file");
        var bl_mt = top.readTextFile(p_file);
        top.gl_bl_mt_list = bl_mt.split(",");
    } catch (e) {
        //avoid throwing exception if there is no blacklist file
    }

    var v_file = top.TOPDIR + getOSCommand("version_file");
    var vc = [];
    if (engineTop.secureFileExists(securityCheck, v_file)) {
        engineTop.secureReadPropertyFile(securityCheck, v_file, vc, false);
        top.gl_version = "Version " + vc["FDR_VER_STRING"];
        top.gl_copyright = vc["FDR_LEGALCOPYRIGHT_STRING"];
        top.gl_min_version = vc["FDR_VER_MAJOR"] + vc["FDR_VER_MINOR"];
    }

}


function mini_init() {
    //Initialize parameters
    var prefix = top.gl_support_folder;
    top.gl_basic_info_file = prefix + "guihelp.dat";
    top.gl_command_file = prefix + "command.txt";
    top.gl_common_result = prefix + "common_result.xml";
    top.gl_proxy_tmpfile = prefix + "spi_proxy_tmp.dat";
    top.gl_loghtml_file = prefix + "spi_log.html";
    top.gl_proxy_config_file = prefix + "proxy.dat";

    top.gl_guiHelper = getOSCommand("guiHelper");
    //top.gl_parProxy = getOSCommand("parProxy");
    if (!top.fileExists(top.gl_basic_info_file)) {
        //Run guiHelper to get basic information, such as machine type and os.
        //In this step, we can't determine the main application's name yet
        var args = [];
        args.push(top.gl_guiHelper);
        var rc = runProgram(null, args, FOREGROUND, HIDDEN, this);

        if (!engineTop.secureFileExists(securityCheck, top.gl_basic_info_file)) {
            console.log("work without external support program");
        } 
        // else {
        //     top.gl_gui_help_run = true;
        // }
    }
    if(top.fileExists(top.gl_basic_info_file)){
        engineTop.secureReadPropertyFile(securityCheck, top.gl_basic_info_file, top.gl_properties_info, false);
    }
    init_os_mt_arch();
    top.gl_current_mulitnodes_d = "0";

    //top.gl_mini_init_run = true;
}



function init_os_mt_arch() {
    var os = top.OS
    var arch = top.ARCHITECURE;
    top.gl_current_mt = getOSType();
    top.gl_current_mt_d = top.gl_current_mt;
    if (top.gl_current_mt == "NONE") {
        top.gl_current_mt_d = "NONE";
        top.gl_isAbnormal = true;
    }
    top.gl_mainAppName = getOSCommand('helpcli_name');

}


function killApp_ux(appName) {
    var args = new Array();
    args.push(top.gl_guiHelper);
    args.push("--kill");
    args.push(appName);
    return runProgram(null, args, FOREGROUND, HIDDEN, this);
}

function deleteFile_ux(file) {
    var args = new Array();
    args.push(top.gl_guiHelper);
    args.push("--delete");
    args.push(file);
    return runProgram(null, args, FOREGROUND, HIDDEN, this);
}

function isRunning(appName) {
    var args = new Array();
    args.push(top.gl_guiHelper);
    args.push("--isrunning");
    args.push(appName);
    if (runProgram(null, args, FOREGROUND, HIDDEN, this)) {
        return true;
    } else {
        return false;
    }

}


/*
 * check whether the path name is valid and whether it exists
 */
function validatePath(path) {
    if (top.trim(path) == "")
        throw "Please input the absolute directory!";
    //support non-English,
    var regExp = null;
    var regExpNet = null;
    if (top.gl_current_os == "windows") //for windows
    {
        //regExp = /^[a-zA-Z]\:(\\[a-zA-Z0-9_ -.]+)*\\{0,1}$/gi;
        regExp = /^[a-zA-Z]\:(\\.+)*\\{0,1}$/gi;
        regExpNet = /^\\\\((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)(\\.+)*\\{0,1}$/gi;
    } else //for linux
    //regExp = /^\/|(\/[a-zA-Z0-9_ -.]+)+\/{0,1}$/gi;
        regExp = /^\/|(\/.+)+\/{0,1}$/gi;
    if (!path.match(regExp) && !path.match(regExpNet))
        throw "Invalid path!";
    else if (!engineTop.secureDirectoryExists(securityCheck, path))
        throw "Unavailable path!";
}

/**
 * filter directory path
 */
function filter(input) {
    input = top.trim(input);
    if (top.OSTYPE == "windows") {
        return "\"" + input + "\"";
    } else {
        //return input.toString().replace(/(\s{1})/g, "\\\ ");
        return input;
    }
}

/*
 * 1234.56 -> 1,234.56
 * input may already have commas, so just return
 */
function formatNumberWithComma(input) {
    var str = "",
        value = input.toString();
    var dotPos = value.indexOf(".");
    var commaPos = value.indexOf(",");
    if (commaPos > -1) {
        return input;
    }
    var integer = dotPos > -1 ? value.substring(0, dotPos) : value;
    var dicemal = dotPos > -1 ? value.substring(dotPos) : "";
    var chars = top.trim(integer).split("");
    for (var i = chars.length - 1; i > -1; i--) {
        str = chars[i] + str;
        if ((chars.length - i) % 3 == 0 && i != 0) {
            str = "," + str;
        }
    }
    return str + dicemal;
}

/*
 * for decimal
 */
function formatData(input) {
    var per = input.toString();
    if (per.indexOf(".") > 0)
        per = per.substring(0, per.indexOf(".") + 3);
    return per;
}
/*
 * for index
 */
function formatNo(input) {
    var result = input.toString();
    switch (input) {
        case 1:
            result += "st";
            break;
        case 2:
            result += "nd";
            break;
        case 3:
            result += "rd";
            break;
        default:
            result += "th";
    }
    return result;
}



function openWorkingDir(id) {
    var dir = top.browseForFolder("Please Select Path:");
    if (dir != null) {
        document.getElementById(id).value = dir;
    }
}

/**
 * return an array with possible dirs corresponding with input
 */
function dirCompletion(input) {
    var matchedDir = new Array();
    var sprt = (top.gl_current_os == "windows") ? "\\" : "/";
    if (input.match(/^[a-zA-Z]\:$/)) //for complete [driver]:\
        input = input + sprt;
    if (input.indexOf(sprt) < 0) { //no '/; or '\'
        matchedDir.push(input);
        return matchedDir;
    }
    var dir = input.substring(0, input.lastIndexOf(sprt) + 1);
    if (!engineTop.secureDirectoryExists(securityCheck, dir)) { //input is not existing or invalid
        matchedDir.push(input);
        return matchedDir;
    }
    if (top.BROWSER == "IExplore") { //if in IE
        var fileSystemObject = new ActiveXObject("Scripting.FileSystemObject");
        var folder = fileSystemObject.GetFolder(dir);
        var enu = new Enumerator(folder.SubFolders);
        while (!enu.atEnd()) {
            var subf = enu.item();
            if (subf.Path.toUpperCase().indexOf(input.toUpperCase()) == 0)
                matchedDir.push(subf.Path);
            enu.moveNext();
        }
    } else { //try ff
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        file.initWithPath(dir);
        var entries = file.directoryEntries; //each entry is a nsIFilese
        if (entries) {
            while (entries.hasMoreElements()) {
                var entry = entries.getNext();
                entry.QueryInterface(Components.interfaces.nsIFile); //nsISupport -> nsIFile
                if (entry.isDirectory() && entry.path.toUpperCase().indexOf(input.toUpperCase()) == 0)
                    matchedDir.push(entry.path);
            }
        }
    }
    return matchedDir;
}

/**
 * Save and clean
 */
function quit() {
    killApp_ux(top.gl_mainAppName);
}

/**
 * Catch the even of closing the current window
 */
function closeWindow() {
    killApp_ux(top.gl_mainAppName);
    if (top.OSTYPE == "windows") {
        if (event.clientY < 0 || event.altKey) {
            //killApp_ux("mshta.exe");
        }
    }
}


/**
 * Unique candidate array, means remove duplicate items
 */
Array.prototype.unique = function() {
    var a = {};
    for (var i = 0; i < this.length; i++) {
        if (typeof a[this[i]] == "undefined")
            a[this[i]] = 1;
    }
    this.length = 0;
    for (i in a)
        this[this.length] = i;
    return this;
}

/**
 * Create a popup window
 * @param pn page name
 * @param header header text shown in the header
 * @param text detail text shown in the main area
 */
function createDetailPage(pn, header, text) {
    var fc = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\"><html><head><title></title><link rel=\"stylesheet\" href=\"content.css\" type=\"text/css\"><style>" + "li{margin-top:1em;width: 80%;list-style: decimal;}" + "body{background: none;}" + "</style></head><body style=\"font-size:smaller;font-family:Tahoma,sans-serif;\">" + "<h1 class=\"MainHeader2\">" + header + "</h1><p class=\"InstructionalText2\">" + text + "</p></body></html>";
    if (top.writeTextFile(top.TOPDIR + "disk1/launchpad/content/" + pn + ".html", fc)) {
        var sWidth = 500;
        var sHeight = 200;
        var l = (screen.availWidth - sWidth) / 2;
        var t = (screen.availHeight - sHeight) / 2;
        var style = 'resizable=no,toolbar=no,status=no,menubar=no,personalbar=no,location=no,directories=no,titlebar=no,scrollbars=no,close=yes';
        var loc = ',left=' + l + ',top=' + t + ',width=' + sWidth + ',height=' + sHeight;
        window.open(findFile(null, pn + ".html"), '', style + loc);
    }
}

/**
 * trim blank space and eliminate other characters 
 */
function updateDirPath(path) {
    path = top.trim(path);
    if (path.charAt(path.length - 1) == '\\') {
        path = path.substring(0, path.length - 1);
    }
    path = "--local=\"" + path + "\"";
    return path;
}


top.startInitTimer();
//call common initialization
common_init();
