if (typeof fs == 'undefined') fs = require('fs');

// change the mouse cursor to look busy or normal
// isBusy: boolean
// doc: document reference
// returns: undefined
/*
function busyCursor(isBusy,doc) {
  try {
    try {
	if (isBusy)
            doc.body.style.cursor='wait';
	else
            doc.body.style.cursor='default';
    } catch(e) {}
  } catch(e) { top.logException(e,arguments); }
}
*/

// create a directory on the file system
// directoryName: string - full native directory name
// returns: 0 = directory was not created.  1 = directory was created successfully
// new implementation by nodejs api
function createDirectory(directoryName) {
	try {
		if (fs.existsSync(directoryName) && (fs.statSync(directoryName).isDirectory())) {
			return false;
		}
		fs.mkdirSync(directoryName);
		return true;
	} catch (e) {
		top.logException(e, arguments);
		return false;
	}
}

// determine if the file or folder exists
// fileName: string - full native file name
// returns:  false if the file does not exist, true otherwise (or if shouldIndicateType is true, 1 if file exists, -1 directory exists, 0 file does not exist)
function fileExists(fileName) {
	return fs.existsSync(fileName);

}
// determine if the file exists
// securityFcn: function = new Function('return window')
// fileName: string - full native file name
// returns: boolean
function secureFileExists(securityFcn, fileName) {
	if (top.isSecure(securityFcn)) {
		return fileExists(fileName);
	}
	return false;
}

// determine if the directory exists
// securityFcn: function = new Function('return window')
// directory: string - full native directory name
// returns: boolean
function secureDirectoryExists(securityFcn, directory) {
	return secureFileExists(securityFcn, directory);
}


// gets the value of an environment variable
// securityFcn: function = new Function('return window')
// anyvar: string - name of variable
// returns: string - value of variable
//          undefined - variable is not defined
function secureGetEnv(securityFcn, anyvar) {
	if (top.isSecure(securityFcn)) {
		return process.env[anyvar];
	}
	return null;
}

// sets the value of an environment variable
// securityFcn: function = new Function('return window')
// anyvar: string - name of variable
// value: string - new value of variable
// returns: boolean - success status
function secureSetEnv(securityFcn, anyvar, value) {
	if (top.isSecure(securityFcn)) {
		process.env[anyvar] = value;
	}
}

// executes an arbitrary command
// securityFcn: function = new Function('return window')
// topDir: string - CD mount point
// args: [strings] - command and parameters
// waitBoolean: boolean - foreground or background
// isHidden: boolean - visible window or silent
// element: document element - element to disable while running
// returns integer - exit code if foreground or process status if background
function secureRunProgram(securityFcn, topDir, args, foreGroundValue, isHidden, element, workingDirectory, callback, timeout) {

	if (top.isSecure(securityFcn)) {
		args[0] = top.getFullFileName(topDir, args[0]);
		var cmd = args[0];
		args.shift();

		if (foreGroundValue == BACKGROUND) {
			var execFile = require('child_process').execFile;
			if (callback) {
				execFile(cmd, args, function(error, stdout, stderr) {
					if (!fileExists(top.gl_common_result)) {
						var content = "<COMMONRESULT><HELPCLI>1</HELPCLI><MESSAGE>Completed Successfully!</MESSAGE><LOGFILE>/var/log/NWizard_Support/spi.log</LOGFILE></COMMONRESULT>";
						writeTextFile(top.gl_common_result, content, false);
					}
					if (error) {
						top.logMessage(error.code, error);
						top.logMessage('stderr: ', stderr);
						console.log('exec error: ' + error);
						callback(false, error); //execute callback function here
						return error.code;
					}
					console.log('stdout: ' + stdout);
					callback(true);
					return 0;
				});
			} else {
				execFile(cmd, args, function(error, stdout, stderr) {
					if (error) {
						top.logMessage(error.code, error);
						top.logMessage('stderr: ', stderr);
						console.log('exec error: ' + error);
						return error.code;
					}
					console.log('stdout: ' + stdout);
					return 0;
				});
			}
		} else { //FOREGROUND
			var execFileSync = require('child_process').execFileSync;
			var retStdout = execFileSync(cmd, args);
			console.log('execFileSync stdout: ' + retStdout);
			return retStdout;
		}


	}

}

// Initializes a callback and creates and returns a file that will contain the return code on exit.
// callback: function - the function to call when the batch finishes
// timeout: int - milliseconds to wait between polls to see if the batch file has completed
// returns: string - the path to the file that will contain the return code to be passed to the callback
/*
function createCallback(callback,element,timeout)
{	
	var returnCodeFilePath = top.createTempFile('launchpadExecReturnCode');	
	var fileSystemObject = new ActiveXObject("Scripting.FileSystemObject");
	var returnCodeFile = fileSystemObject.GetFile(returnCodeFilePath);

	// Setup and start timeout for callback function
	var originalCallback = callback;
	callback = function()
	{
		try
		{
			if(returnCodeFile.size > 0)
			{
				var returnCode = top.trim(readTextFile(returnCodeFile.Path));
				returnCodeFile.Delete(true);
				if(element) top.enableElement(element,true);
				originalCallback(returnCode);
			}
			else
			{
				window.setTimeout(callback,timeout);
			}
		}
		catch(e)
		{
			top.logException(e, arguments);
		}
	};
	window.setTimeout(callback,timeout);

	return returnCodeFilePath;
}
*/
// new implementation by nodejs api
function createCallback(calllback, element, timeout) {
	var returnCodeFilePath = top.createTempFile('launchpadExecReturnCode');
	var returnCode = (fs.readFileSync(returnCodeFilePath)).toString();
	var originalCallback = callback;
	callback = function() {
		try {
			if (returnCode.length > 0) {
				returnCode = top.trim(returnCode);
				fs.unlinkSync(returnCodeFilePath);
				if (element) top.enableElement(element, true);
				originalCallback(returnCode);
			} else {
				window.setTimeout(callback, timeout);
			}
		} catch (e) {
			top.logException(e, arguments);
		}
	};
	window.setTimeout(callback, timeout);

	return returnCodeFilePath;
}

// get a list of child directories
// securityFcn: function = new Function('return window')
// dir: string - parent directory
// returns: [directory name strings]
function secureGetDirectories(securityFcn, dir) {
	try {
		fs.accessSync(dir);
	} catch (e) {
		return [];
	}
	return fs.readdirSync(dir).filter(function(file) {
		return fs.statSync(dir + file).isDirectory();
	});

}

// get a list of child files
// securityFcn: function = new Function('return window')
// dir: string - parent directory
// returns: [file name strings]
// new implementation by nodejs api
function secureGetFiles(securityFcn, dir) {
	try {
		fs.accessSync(dir);
	} catch (e) {
		return [];
	}
	return fs.readdirSync(dir).filter(function(file) {
		return !(fs.statSync(dir + file).isDirectory());
	});
}

function deleteFile(file) {
	if (fileExists(file)) {
		fs.unlinkSync(file);
	}
	return true;
}


// read an external file
// fileName: string - full native file name or URL
// returns: string - contents of file if readable, null otherwise
function readTextFile(fileName) {

	if (fileName == null)
		return null;
	return fs.readFileSync(fileName, 'utf8');
}



// read an external file
// securityFcn: function = new Function('return window')
// fileName: string - full native file name
// returns: [line strings]
function secureReadTextFile(securityFcn, fileName) {
	try {

		if (!top.isSecure(securityFcn)) {
			return null;
		}

		var fileContents = readTextFile(fileName);
		var fileLines = fileContents.split(/\r*\n/);
		if (fileLines.length > 0)
		//yeah this is smart, this is to remove the empty lines at the end of a file
			if (fileLines[fileLines.length - 1].length == 0)
				fileLines.pop();

		return fileLines;

	} catch (e) {
		//FSO failed, there's nothing we can do to read this files    
		top.logException(e, arguments);
	}
}

// write a text file
// fileName: string - full native file name
// text:  string - content of text file
// append: boolean - true = append text to end of file,  false = overwrite existing file
// returns: true if file was written successfully, false otherwise
function writeTextFile(fileName, fileContent, append) {
	if (!fileContent) {
		console.error("No fileContent.");
		return false;
	}
	if (append && fileExists(fileName)) {
		fs.appendFileSync(fileName, fileContent);
	} else {
		fs.writeFileSync(fileName, fileContent);
	}
	return true;

}


// exit launchpad
// securityFcn: function = new Function('return window')
// returns: void
function secureExit(securityFcn) {
	try {
		if (top.isSecure(securityFcn)) {
			try {
				window.close();
			} catch (e) {
				alert("ERROR: Exit failed");
			}
		}
	} catch (e) {
		top.logException(e, arguments);
	}
	winclose(); //Rarely called when debugging and refresh windows.
}


function winclose() {
  var gui = require('nw.gui');
  var win = gui.Window.get();
  win.close();
}

// Init log filter now that we have access to env vars
logInitFilter();