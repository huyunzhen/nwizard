var lang = {
	BANNER_TITLE: "系统更新",
	SPI_BOOTABLE: top.getEnv("SPI_BOOTABLE"),
	Active_Machine_Type: "操作系统: " + top.gl_current_mt_d,
	OS_AND_ARCH: " 系统型号: " + getOS() + getArch(),
	Software_License_Agreement: "软件许可证协议",
	Please_Read_Carefully: "请仔细阅读以下许可证协议",
	ACCEPT: "接受",
	DECLINE: "拒绝",
	I_ACCEPT: "我接受以上条款",
	I_DONOT_ACCEPT: "我不接受以上条款",
	Read_NOTICES_AND_INFORMATION: "阅读注意事项和信息",
	Read_UPDATES_DOWNLOAD_TERMS: "阅读更新下载条款"	
};
if(typeof module !== 'undefined'){
    module.exports = lang;	
}
