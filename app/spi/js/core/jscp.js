
var defaultIndex = "default";
var engineTop;
if (typeof window.opener == "undefined" || window.opener == null)
  engineTop = top;
else
  engineTop = window.opener.top;

var securityCheck = new Function('return window');

var openWindows = new Array();

// log unknown syntax errors
if (typeof window.onerror == "undefined")
  window.onerror = function onErrorHandler(msg, fn, line) {
    engineTop.logMessage("LPV20011E", msg, fn, line);
    return true;
  }

//<ACGC_Bidi> start
function bidiString(rtl, ltr) {
  if (top.isBidiLocale()) {
    return rtl;
  }
  return ltr;
}
//<ACGC_Bidi> end

function property(varName, defaultValue) {
  return engineTop.findProperty(varName, self, defaultValue);
}

//Sets a property to a specified value
//varName - the name of the property
//value - the new value of the property
function setProperty(varName, value) {
  return engineTop.assignProperty(varName, self, value);
}

FOREGROUND = true;
BACKGROUND = false;
VISIBLE = false;
HIDDEN = true;
// executes an arbitrary command
// diskID: string - ID that gets mapped to the current full directory path for relative names
// args: [strings] - command and parameters
// foreGroundValue: boolean - FOREGROUND or BACKGROUND
// isHidden: boolean - VISIBLE or HIDDEN
// element: document element - element to disable while running
// returns: integer - exit code if foreground or process status if background
LAUNCHPAD_DISKID = null;
NO_DISKID = engineTop.UNDEFINED;

function runProgram(diskID, args, foreGroundValue, isHidden, element, workingDirectory, callback, timeout) {

  //var disk = engineTop.getDiskMapping(diskID);  move command folder to the nwizard/command
  var disk = top.TOPDIR;
  //Comment the following legacy code, cause we are removing diskLabels.js
  //if ((disk == null) && (typeof diskID != "undefined")) {
  //    return -1;
  //}

  return engineTop.secureRunProgram(securityCheck, disk, args, foreGroundValue, isHidden, element, workingDirectory, callback, timeout);
}

// see if a messy-named file exists
// diskID: string - ID that gets mapped to the current full directory path for relative names
// name: string - messy file name
// returns string - full native file if it exists
//         null - if not exists
function clientFileExists(diskID, name) {
  return engineTop.secureClientFileExists(securityCheck, engineTop.getDiskMapping(diskID), name);
}

//Determines if a directory exists
// diskID: string - ID that gets mapped to the current full directory path for relative names
// fileName: string - full native directory name
// returns: boolean
function directoryExists(diskID, directory) {

  var topDir = engineTop.getDiskMapping(diskID);
  var fullDirectory = top.getFullFileName(topDir, directory);

  return engineTop.secureDirectoryExists(securityCheck, top.getNativeFileName(fullDirectory));
}

// search for a file
// diskID: string - ID that gets mapped to the current full directory path for relative names
// name: string - relative path to find
// returns string - full native file name if found
//         undefined/null if not found
// search order:
//      menuExtension/locale  if applicable
//      menuExtension/fallback locale  if applicable
//      menuExtension/    if applicable
//      content/locale
//      content/fallback locale
//      content
//      skin/locale
//      skin/fallback locale
//      skin
//      launchpad/locale
//      launchpad/fallback locale
//      launchpad
function findFile(diskID, name) {

  var fallBackLocale = property('fallBackLocale', 'en');
  return engineTop.secureFindFile(securityCheck, engineTop.getDiskMapping(diskID), name, fallBackLocale, self);
}

// diskID: string - ID that gets mapped to the current full directory path for relative names
function findURL(diskID, name) {
  var i = name.indexOf('?');
  var fullFileName = findFile(diskID, (i > 0) ? name.substring(0, i) : name);
  return top.nativeFileToURL(fullFileName + ((i > 0) ? name.substring(i) : ''));
}

//Searches a list of paths for a file with a give disk ID
//
//sample usage
//  var pathList = new Array();
//  pathList.push(startingDir + top.LOCALE);
//  pathList.push(startingDir + fallBackLocale);
//  return findFileInPaths(pathList, 'foo.txt');
//
// pathList - a list of paths to be searched
// name - the file to search for
function findFileInPaths(diskID, pathList, name) {
  var file = null;
  if ((typeof pathList == "object") && (pathList.length > 0)) {
    var startingDir = engineTop.getDiskMapping(diskID);
    if ((startingDir == null) || (startingDir.length == 0))
      startingDir = '';
    for (var i in pathList) {
      var fullPath = top.getFullFileName(startingDir, pathList[i] + '/' + name);
      if (top.secureFileExists(securityCheck, fullPath)) {
        file = fullPath;
        break;
      }
    }
  }
  return file;
}

// This function allows the content writer to search for files of the form
// fileName_xx.extension where xx is a locale code.  This is a different
// translated file naming convention than what the launchpad uses internally.
// Sometimes, files must conform to external naming conventions that do not
// match the launchpads conventions.  
// 
// Usage: findTranslatedFileInDirectory(NO_DISKID, top.STARTINGDIR + '/info/, 'readme_xx.html');
// diskId - the launchpad disk id
// directory - directory where the file is located
// templateFileName - a template for the file name.  This function will replace _xx with _<locale>
// and return the path to that file.  If the file for the current locale cannot be found, this function
// will try the fallBackLocale.  If that cannot be found, it will return null
function findTranslatedFileInDirectory(diskID, directory, templateFileName) {
  var file = null;
  var startingDir = engineTop.getDiskMapping(diskID);
  if ((startingDir == null) || (startingDir.length == 0)) {
    startingDir = directory;
  } else {
    startingDir += "/" + directory;
  }

  file = top.getFullFileName(startingDir, templateFileName);
  file = file.replace("_xx", "_" + top.LOCALE);
  if (!top.secureFileExists(securityCheck, file)) {
    file = top.getFullFileName(startingDir, templateFileName);
    file = file.replace("_xx", "_" + property('fallBackLocale'));
    if (!top.secureFileExists(securityCheck, file)) {
      file = null;
      engineTop.logMessage('LPV22040W', top.getFullFileName(startingDir, templateFileName));
    }
  }
  return file;

}

// get and format a platform dependent command to execute
// commandID: string - property name of array of platform dependent command templates
// arguments: [strings] - optional substitution parameters
function getOSCommand(commandID) {
  //Comment legacy code
  //return engineTop.getCommand(property(commandID,null), arguments);

  //Refer to global.js top.Commands for data structure
  var tmpCommand = null;
  if (top.OSTYPE == "windows") {
    tmpCommand = top.Commands[commandID][top.windows];
  } else {
    tmpCommand = top.Commands[commandID][top.linux];
  }

  //TODO workaround, return an array "os_suffix", simplify this later
  if (commandID == "os_suffix") {
    return tmpCommand;
  }

  //Check if command value is a string, otherwise it is an array and need further compare arch, 0 index is for 32 OS, and 1 index is for x64 OS
  if (typeof(tmpCommand) != "string") {
    if (top.ARCHITECURE == "x64") {
      return tmpCommand[1];
    } else {
      return tmpCommand[0];
    }
  }
  return tmpCommand;
}
// Generic utility to best match the operating system
// commandDataArray: [strings] - array of platform dependent command templates
//TODO after remove the usage in getCommand, this function seems only used in diskLables service, need to double check if we can remove it.
function getBestOSMatch(labelArray) {
  var retVal = null;

  var osArchCombinations = new Array();
  osArchCombinations[0] = top.OS + "/" + top.ARCHITECTURE + "->" + top.TARGETOS + "/" + top.TARGETARCHITECTURE;
  osArchCombinations[1] = top.OS + "/" + top.ARCHITECTURE + "->" + top.TARGETOS;
  osArchCombinations[2] = top.OS + "/" + top.ARCHITECTURE + "->" + top.TARGETOSTYPE + "/" + top.TARGETARCHITECTURE;
  osArchCombinations[3] = top.OS + "/" + top.ARCHITECTURE + "->" + top.TARGETOSTYPE;
  osArchCombinations[4] = top.OS + "->" + top.TARGETOS + "/" + top.TARGETARCHITECTURE;
  osArchCombinations[5] = top.OS + "->" + top.TARGETOS;
  osArchCombinations[6] = top.OS + "->" + top.TARGETOSTYPE + "/" + top.TARGETARCHITECTURE;
  osArchCombinations[7] = top.OS + "->" + top.TARGETOSTYPE;
  osArchCombinations[8] = top.OSTYPE + "/" + top.ARCHITECTURE + "->" + top.TARGETOS + "/" + top.TARGETARCHITECTURE;
  osArchCombinations[9] = top.OSTYPE + "/" + top.ARCHITECTURE + "->" + top.TARGETOS;
  osArchCombinations[10] = top.OSTYPE + "/" + top.ARCHITECTURE + "->" + top.TARGETOSTYPE + "/" + top.TARGETARCHITECTURE;
  osArchCombinations[11] = top.OSTYPE + "/" + top.ARCHITECTURE + "->" + top.TARGETOSTYPE;
  osArchCombinations[12] = top.OSTYPE + "->" + top.TARGETOS + "/" + top.TARGETARCHITECTURE;
  osArchCombinations[13] = top.OSTYPE + "->" + top.TARGETOS;
  osArchCombinations[14] = top.OSTYPE + "->" + top.TARGETOSTYPE + "/" + top.TARGETARCHITECTURE;
  osArchCombinations[15] = top.OSTYPE + "->" + top.TARGETOSTYPE;
  osArchCombinations[16] = top.OS + "/" + top.ARCHITECTURE;
  osArchCombinations[18] = top.OS;
  osArchCombinations[17] = top.OSTYPE + "/" + top.ARCHITECTURE;
  osArchCombinations[19] = top.OSTYPE;
  osArchCombinations[20] = defaultIndex;

  for (var i = 0; i < osArchCombinations.length; i++) {
    if (labelArray[osArchCombinations[i]]) {
      retVal = labelArray[osArchCombinations[i]];
      break;
    }
  }

  //If we get through all of the combinations and don't have a match, just return the array
  if (typeof retVal == "undefined" || retVal == null) {
    try {
      retVal = labelArray;
    } catch (e) {}
  }
  return retVal;
}

// gets the value of an environment variable
// name: string - name of variable
// returns: string - value of variable
//          undefined - variable is not defined
function getEnv(name) {
  return engineTop.secureGetEnv(securityCheck, name);
}

// sets the value of an environment variable
// name: string - name of variable
// value: string - new value of variable
// returns: boolean - success status
function setEnv(name, value) {
  return engineTop.secureSetEnv(securityCheck, name, value);
}

// exits launchpad
// showPrompt: boolean - Determines if an "Are you sure you want to exit" dialog will be shown
// returns void
function Exit(showPrompt) {

  if (typeof showPrompt == "boolean" && showPrompt == true) {
    if (confirm(property('exitPrompt', 'Are you sure you want to exit?')) == false) {
      return;
    }
  }
  return engineTop.secureExit(securityCheck);
}

// repaint the current HTML doc
// returns void
function refreshPage() {
  return document.location.reload(false);
}

// 
// doc write and log substitution parse errors
//   badEvalString : Escaped substitution string that failed evaluation.
//   This is done as a separate function to avoid inlining this code
//   for every substitution
function substituteParseError(badEvalString) {
  document.write('Undefined reference in ' + document.baseName + ' : ' + unescape(badEvalString));
  engineTop.logMessage('LPV20001S', document.location.href, engineTop.trim(unescape(badEvalString)));
}