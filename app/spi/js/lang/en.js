var lang = {
	BANNER_TITLE: "System Pack Installer",
	SPI_BOOTABLE: top.getEnv("SPI_BOOTABLE"),
	Active_Machine_Type: "OS Type: " + top.gl_current_mt_d,
	OS_AND_ARCH: " OS Release: " + getOS() + getArch(),
	Software_License_Agreement: "Software License Agreement",
	Please_Read_Carefully: "Please read the following license agreement carefully",
	ACCEPT: "Accept",
	DECLINE: "Decline",
	I_ACCEPT: "I accept the terms in the license agreement",
	I_DONOT_ACCEPT: "I do not accept the terms in the license agreement",
	Read_NOTICES_AND_INFORMATION: "Read NOTICES AND INFORMATION",
	Read_UPDATES_DOWNLOAD_TERMS: "Read UPDATES DOWNLOAD TERMS"
};
if(typeof module !== 'undefined'){
    module.exports = lang;	
}
