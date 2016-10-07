Finish = function() {

	function finish_init() {
		if (top.gl_isUpdate) {
			document.getElementById("completeMsg").innerHTML = "<BR><BR><img src='images/statusInformation_obj16.gif'> ";
			document.getElementById("completeMsg").innerHTML += "That is all of the information required. Your update should be complete.";

		} else {
			document.getElementById("completeMsg").innerHTML = "<BR><BR><img src='images/statusInformation_obj16.gif'> ";
			document.getElementById("completeMsg").innerHTML += "That is all of the information required. Your acquisition should be complete.";
		}

		//top.enableButton("previousButton", false);

		if (top.getEnv("UNATTENDED_MODE")) {
			top.Exit(false);
		}
	}

	function dumpLog() {
		alert("The log will be brought up in a separate browser window.\nPress \"Ctrl + w\" to return.");
		var mywidth = 600;
		var myheight = 400;
		var myleft = (screen.width - mywidth) / 2;
		var mytop = (screen.height - myheight) / 2;
		var logopts = 'width=' + mywidth + ', height=' + myheight;
		logopts += ', top=' + mytop + ', left=' + myleft;
		logopts += ', directories=no';
		logopts += ', location=no';
		logopts += ', menubar=yes';
		logopts += ', resizable=yes';
		logopts += ', scrollbars=yes';
		logopts += ', status=no';
		logopts += ', toolbar=no';
		logopts += ', close=yes';
		var logos = top.readTextFile(top.gl_logfile);
		logos = "<HTML><BODY><PRE>" + logos + "<\/PRE><\/BODY><\/HTML>";
		top.writeTextFile(top.gl_loghtml_file, logos);
		var logwindow = window.open(top.gl_loghtml_file, "", logopts);
		if (window.focus) {
			logwindow.focus();
		}
	}

	function saveLog() {

	}

	function getUsbInfo() {
		try {

			var usbFile = top.readTextFile(top.gl_UsbInfoFile);
			if (usbFile != null) {
				var cfDom_1 = ezJsLib.XmlDom.parse(usbFile);
			}
		} catch (e) {
			alert("No Usb available");
		}



	}

	function generateUsbFile() {

	}

	function saveLogFileToUSb() // multi choice
	{

	}

	return {
		name: "Finish",
		index: 0,
		init: finish_init,
		nextAction: function(){ return true; },
		importId: '#import_finish',
		selectorId: '.finish',
		title: "Finish",
		dumpLog: dumpLog,
	}
}();