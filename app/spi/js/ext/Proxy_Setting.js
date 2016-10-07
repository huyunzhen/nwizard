Proxy_Setting = function() {


    var proxyStatus = 0;
    var inited = false;

    //Collect param and goto Next page.
    function proxy_collect() {
        //use proxy
        if (document.getElementById("proxy").checked) {
            var ret = checkUserInput();
            if (ret != 0) {
                if (ret == 1) {
                    alert('Please set both proxy address and port!');
                } else if (ret == 2) {
                    alert('The value in the Port field must be a whole number between 1 and 65535.');
                } else if (ret == 3) {
                    alert('Please set User Name!');
                }
                return false;
            }
            saveParameters();
            top.gl_isProxy = true;
        } else {
            top.gl_isProxy = false;
        }
        return true;
    }

    function enableProxy() {

        if (document.getElementById("proxy").checked) {
            document.getElementById("proxyTable").style.display = "";
            document.getElementById("ProxyAcountTable").style.display = "";
            document.getElementById("CheckAuthenticate").style.display = "";
            document.getElementById("buttonTest").style.display = "";
            var check = document.getElementById("checkAccount").checked;
            document.getElementById("ProxyAcountTable").disabled = !check;
            document.getElementById("pUid").disabled = !check;
            document.getElementById("pPwd").disabled = !check;
            document.getElementById("ResultInfo").style.display = "";
        } else {
            document.getElementById("proxyTable").style.display = "none";
            document.getElementById("ProxyAcountTable").style.display = "none";
            document.getElementById("CheckAuthenticate").style.display = "none";
            document.getElementById("buttonTest").style.display = "none";
            document.getElementById("ResultInfo").style.display = "none";
        }

    }

    function saveParameters() {
        if (document.getElementById("proxy").checked) {
            top.gl_proxy_address = document.getElementById("pAdd").value;
            top.gl_proxy_port = document.getElementById("pPort").value;
            if (document.getElementById("checkAccount").checked) {
                top.gl_proxy_username = document.getElementById("pUid").value;
                top.gl_proxy_password = document.getElementById("pPwd").value;
            } else {
                top.gl_proxy_username = "";
                top.gl_proxy_password = "";
            }
        } else {
            top.gl_proxy_address = "";
            top.gl_proxy_port = "";
            top.gl_proxy_username = "";
            top.gl_proxy_password = "";
        }
    }

    function setProxy(obj) {
        // TODO:address must be number & can be " "
        if (obj.id == "pAdd") {
            obj.value = top.trim(obj.value);
        } else if (obj.id == "pPort") {
            obj.value = top.trim(obj.value);
        } else if (obj.id == "pUid") {
            obj.value = top.trim(obj.value);
        } else if (obj.id == "pPwd") {
            obj.value = top.trim(obj.value);
            top.gl_using_secure = false;
        }
    }

    function proxy_init() {
        if (!inited) {
            var args = new Array();
            args.push(top.gl_proxy_config_file);
            if (engineTop.secureFileExists(securityCheck, top.gl_proxy_config_file)) {
                engineTop.secureReadPropertyFile(securityCheck, top.gl_proxy_config_file, top.gl_proxy_info, false);
                top.gl_proxy_address = top.gl_proxy_info["PROXY_ADDRESS"];
                top.gl_proxy_port = top.gl_proxy_info["PROXY_PORT"];
                top.gl_proxy_username = top.gl_proxy_info["PROXY_USERNAME"];
                top.gl_proxy_password_secure = top.gl_proxy_info["PROXY_PASSWORD_SECURE"];
                top.gl_isProxy = true;
                document.getElementById("proxy").checked = true;
                document.getElementById("pAdd").value = top.gl_proxy_address;
                document.getElementById("pPort").value = top.gl_proxy_port;
                document.getElementById("proxy").focus();
                if (top.gl_proxy_username == "NULL") {
                    document.getElementById("checkAccount").checked = false;
                } else {
                    document.getElementById("checkAccount").checked = true;
                    document.getElementById("pUid").value = top.gl_proxy_username;
                    document.getElementById("pPwd").value = top.gl_proxy_password_secure;
                }
                top.gl_using_secure = true;
            } else {
                document.getElementById("proxy").checked = false;
                document.getElementById("checkAccount").checked = false;
                document.getElementById("proxy").focus();
                top.gl_isProxy = false;
            }
            enableProxy(document.getElementById("proxy").checked);
            inited = true;
        } else {
            if (document.getElementById("proxy").checked)
                document.getElementById("proxy").focus();
        }
    }

    function showAccount(status) {
        if (status) {
            var check = document.getElementById("checkAccount").checked;
            document.getElementById("ProxyAcountTable").disabled = !check;
            document.getElementById("pUid").disabled = !check;
            document.getElementById("pPwd").disabled = !check;
        } else {
            document.getElementById("ProxyAcountTable").disabled = true;
            document.getElementById("pUid").disabled = true;
            document.getElementById("pPwd").disabled = true;
        }
    }



    function TestConnection() {
        top.enableButton("previousButton", false); //disable "next" button
        top.enableButton("nextButton", false); //disable "next" button

        $(".statusImg").html("<img src=\"images/progress_anim2.gif\" >");
        DisplayInnerText("InfoText", "Testing the connection to the default service provider...");

        var retCode = 0;
        retCode = checkUserInput(); {
            if (retCode == 1) {
                //missing hostname or port info
                $(".statusImg").html("<img src=\"images/StatusCritical.gif\" >");
                DisplayInnerText("InfoText", "The proxy server and port info should be provided.");
                top.enableButton("previousButton", true); //enable "next" button
                top.enableButton("nextButton", true); //enable "next" button
                proxyStatus = -1; //Error detected
                return;
            } else if (retCode == 2) {
                //invalid input
                $(".statusImg").html("<img src=\"images/StatusCritical.gif\" >");
                DisplayInnerText("InfoText", "The value in the Port field must be a whole number between 1 and 65535.");
                top.enableButton("previousButton", true); //enable "next" button
                top.enableButton("nextButton", true); //enable "next" button
                proxyStatus = -1; //Error detected
                return;
            } else if (retCode == 3) {
                //empty userid or password provided
                $(".statusImg").html("<img src=\"images/StatusCritical.gif\" >");
                DisplayInnerText("InfoText", "Please set User Name!");
                top.enableButton("previousButton", true); //enable "next" button
                top.enableButton("nextButton", true); //enable "next" button
                proxyStatus = -1; //Error detected
                return;
            }
        }

        deleteFile_ux(top.gl_proxy_tmpfile);
        var args = new Array();
        args.push(top.gl_proxyTransfer);
        args.push(top.gl_proxyChecker);
        args.push(document.getElementById("pAdd").value);
        args.push(document.getElementById("pPort").value);
        if (document.getElementById("checkAccount").checked) {
            args.push(document.getElementById("pUid").value);
            if (document.getElementById("pPwd").value != "")
                args.push(document.getElementById("pPwd").value);
            // If it is encrypted password, transfer it again to be differentiated with plain text password
            if (top.gl_using_secure)
                args.push(document.getElementById("pPwd").value);
        }
        runProgram(null, args, BACKGROUND, HIDDEN, this);

        timer_update = setInterval(showChkProxy_step_2, 3000);
    }

    function showChkProxy_step_2() {
        var retCode = 0;

        retCode = parseCheckProxyResult();
        if (retCode == 1) {
            //need not authorize
            clearInterval(timer_update);
            $(".statusImg").html("<img src=\"images/statusSuccess.gif\" >");
            DisplayInnerText("InfoText", "Internet connection test completed successfully.");
            top.enableButton("previousButton", true); //enable "next" button
            top.enableButton("nextButton", true); //enable "next" button
            proxyStatus = 1; //status OK
        } else if (retCode == 2) {
            //need authorize
            clearInterval(timer_update);

            if (document.getElementById("checkAccount").checked == true) {
                //wrong account info provided
                $(".statusImg").html("<img src=\"images/StatusCritical.gif\" >");
                DisplayInnerText("InfoText", "Wrong account info provided, please check.");
                top.enableButton("previousButton", true); //enable "next" button
                top.enableButton("nextButton", true); //enable "next" button
                proxyStatus = -1; //Error detected
            } else {
                $(".statusImg").html("<img src=\"images/StatusInformation.png\" style=\"float:left;\">");
                DisplayInnerText("InfoText", "Account info is required for authenticating.");
                top.enableButton("previousButton", true); //enable "next" button
                top.enableButton("nextButton", true); //enable "next" button
                proxyStatus = -1; //Error detected
            }
        } else if (retCode == 3) {
            //wrong proxy server info provided
            clearInterval(timer_update);
            $(".statusImg").html("<img src=\"images/StatusCritical.gif\" >");
            DisplayInnerText("InfoText", "An error occurred while testing for connectivity to the default service provider.");
            top.enableButton("previousButton", true); //enable "next" button
            top.enableButton("nextButton", true); //enable "next" button
            proxyStatus = -1; //Error detected
        }

    }

    function checkUserInput() {
        if (document.getElementById("pAdd").value == "" || document.getElementById("pPort").value == "") {
            if (document.getElementById("pAdd").value == "") {
                document.getElementById("pAdd").focus();
            } else {
                document.getElementById("pPort").focus();
            }
            return 1;
        } else {
            if (isNaN(document.getElementById("pPort").value) || document.getElementById("pPort").value < 1 || document.getElementById("pPort").value > 65535) {
                document.getElementById("pPort").focus();
                return 2;
            }
        }

        if (document.getElementById("checkAccount").checked) {
            if (document.getElementById("pUid").value == "") {
                document.getElementById("pUid").focus();
                return 3;
            }
        }
        return 0;
    }

    function parseCheckProxyResult() {
        var fileLines;
        fileLines = top.readTextFile(top.gl_proxy_tmpfile);

        if (fileLines.length <= 0) {
            //still checking
            return 0;
        } else {
            if (fileLines.indexOf("need not authorize") >= 0) {
                //need not authorize
                return 1;
            }
            if (fileLines.indexOf("need authorize") >= 0) {
                //need authorize
                return 2;
            }
            if (fileLines.indexOf("Error") >= 0) {
                //need authorize
                return 3;
            }
        }
        // other error. failed to connect to the proxy server
        return 3;
    }

    function DisplayInnerText(pTagName, textVal) {
        if (top.OSTYPE == "windows") {
            document.all(pTagName).innerText = textVal;
        } else {
            document.all(pTagName).innerHTML = textVal;
        }
    }

    return {
        name: "Proxy_Setting",
        index: 0,
        init: proxy_init,
        nextAction: proxy_collect,
        importId: '#import_proxy_setting',
        selectorId: '.proxy_setting',
        title: "Proxy Setting"
    }
}();