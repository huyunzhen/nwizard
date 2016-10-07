var Undefined;
top.UNDEFINED = Undefined;
top.GLOBALPROPERTIES = "global.properties";
top.BOOTSTRAPPROPERTIES = "bootstrap.properties";
top.GLOBALCSS = "global.css";
top.THISDISKINFO = "thisDisk.properties";
top.ALLDISKLABELS = "allDisks.labels";
top.DISKINFODIR = "diskinfo/";
top.RELATIVEDIR = "spi/";
top.CONTENTDIR = "content/";
top.JSDIR = "js/";
top.IMAGEDIR = "images/";
top.EXTENSIONSDIR = "extensions";
top.EXTENSIONPROPERTIES = "extension.properties";
top.EXTENSIONJS = "extension.js";

// Fallback to the en locale
fallBackLocale = "en";

// for test
MCP_KERNEL=['0'];

// Variables
top.windows = 0;
top.linux = 1;


//Commands
top.Commands = {
	guiHelper : ['command\\guihelper.exe', 'command/guihelper.sh'],
	blacklist_file : ['blacklist.dat','blacklist.dat'],
	version_file : ['version.inc','version.inc'],
	app_cli_name : [['app_cli.exe', 'app_cli_x64.exe'],'app_cli.sh'],
	helpcli_name: ['command\\helpcli\\helpme.exe', 'command/helpcli/helpme.sh'],
	os_suffix : ['exe', ['rhel6', 'rhel6_64', 'rhel7', 'rhel7_64', 'sles10', 'sles10_64', 'sles11', 'sles11_64']]
};

top.BROWSER = "Chrome";

app_version = "1.0";

navigationMode = "wizard";

//TODO change system to a meaningful value
languageSelectionType="system";

//validLicenseLocales=[['cs','Czech'],['en','English'],['fr','French'],['de','German'],['it','Italian'],['ja','Japanese'],['ko','Korean'],['pl','Polish'],['pt','Portuguese'],['zh','Simplified Chinese'],['es','Spanish'],['tc','Traditional Chinese'],['tr','Turkish'],['el','Greek'],['lt','Lithuanian'],['ru','Russian'],['sl','Slovenian']]

top.validLicenseLocales=[{'en':'English'}];
//do not remove this line