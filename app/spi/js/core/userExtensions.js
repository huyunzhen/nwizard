//This check can be passed as an argument to an secure functions 
//in the API that you call or any secure functions you define in
//secureUserExtensions.js
var userSecurityCheck = new Function('return window');

//***********************************************************************************
// Global Variable
//***********************************************************************************
var bProxyShow = false;
var gl_bl_mt_list = new Array();
var gl_isUpdate = true;
var gl_basic_info_file = "";
var gl_config_list = new Array();
var gl_properties_info = new Array();
var gl_mainAppName;
var gl_guiHelper;

var gl_command_file;
var gl_current_mt;
var gl_current_os;
var gl_current_mt_d;
var gl_current_mulitnodes_d;
var gl_isProxy = false;
var gl_proxy_username;
var gl_proxy_password;
var gl_proxy_address;
var gl_proxy_port;
var gl_proxy_password_secure;
var gl_using_secure = true;
var gl_proxy_config_file;
var gl_proxy_info = new Array();
var gl_proxy_tmpfile;
//var gl_mainAppName_dir;
//var gl_gui_help_run = false;
//var gl_mini_init_run = false;
var gl_systemDrive;
var gl_isAbnormal = false;
var gl_mainAppName_cli = new Array();
//var gl_proxyChecker;
//var gl_proxyTransfer;
var gl_version = "";
var gl_min_version = "";
var gl_copyright = "";
var gl_support_folder = "";
var gl_UsbInfoFile = "";

if (top.OSTYPE == "windows") {
  gl_systemDrive = top.getEnv("SystemDrive");
  gl_support_folder = gl_systemDrive + "\\NWizard\\";
} else {
  gl_support_folder = "/var/log/NWizard/";
}

/*show waiting msg when initializing*/
var initializing_timer;
var timer_cnt = 0;
var gl_isInitializing = false;


function getComErrMsg() {
  if (top.OSTYPE == "windows")
    return "Unknown Failure: The default location for the log file is C:/NWizard directory and log file is called spi*.log where \"*\" includes the system name and a timestamp.";
  else
    return "Unknown Failure: The default location for the log file is /var/log/NWizard directory and log file is called spi*.log where \"*\" includes the system name and a timestamp.";
}
//***********************************************************************************
// File Operations
//***********************************************************************************

var gblElName = "";
var reqFileOperations = new Array();

function assignElText(text) {
  document.getElementById(gblElName).innerHTML = text;
}

function getSimpleSetting(xmlDoc, section, setting) {

  var allSections = xmlDoc.getElementsByTagName("root").item(0);
  var i = 0;
  var sectionNode;
  var resultStr = "";

  for (i = 0; i < allSections.childNodes.length; i++) {
    if (allSections.childNodes[i].attributes) {
      if (allSections.childNodes[i].attributes.getNamedItem("name").nodeValue == section) {
        sectionNode = allSections.childNodes[i];
        break;
      }
    } else {

      //could not find any node attributes
    }
  }

  for (i = 0; i < sectionNode.childNodes.length; i++) {
    if (sectionNode.childNodes[i].attributes.getNamedItem("name").nodeValue == setting) {
      resultStr = sectionNode.childNodes[i].attributes.getNamedItem("value").nodeValue;
      break;
    }
  }
  return resultStr;
}

function hideWaitingMsg() {
  var gStatusPanel = document.getElementById("licenseModal");
  gStatusPanel.style.display = "none";

  var overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}

function startInitTimer() {

  gl_isInitializing = true;
  timer_cnt = 0;
  //TODO change setInterval to setTimeout to improve performance
  initializing_timer = setTimeout(updateInitStatus, 1000);
}


function toggleElementsStatus(disable) {
  var buttons = document.getElementsByTagName("input");
  for (var i = 0; i < buttons.length; ++i) {
    if (buttons[i].type == "button") {
      buttons[i].disabled = disable;
    }
  }

  var prev = top.root.footer.document.getElementById("previousButton");
  prev.disabled = disable;

  var next = top.root.footer.document.getElementById("nextButton");
  next.disabled = disable;
}


function updateInitStatus() {
  var mainAppDir = top.TOPDIR;
  gl_isInitializing = false;
  if (LicenseAgreement.isAccepted() == true) {
    toggleElementsStatus(false);
    hideWaitingMsg();
  } else {
    if (top.getEnv("SPI_BOOTABLE")) {
      if (top.getEnv("UNATTENDED_MODE")) {
        toggleElementsStatus(false);
        hideWaitingMsg();
      }
    }
  }

}