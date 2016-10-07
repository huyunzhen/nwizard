//top.OSTYPE = "windows";
top.OSTYPE = getGenericOSType();

//if (typeof top.OS == "undefined") top.OS = secureGetEnv(new Function('return window'), "LaunchPadOS" );
if (typeof top.OS == "undefined") top.OS = getOS();

//top.ARCHITECTURE = secureGetEnv(new Function('return window'), "LaunchPadArch");
top.ARCHITECURE = getArch();

//Set the target OS/Arch variables    
top.TARGETOS = top.OS;

top.TARGETOSTYPE = top.OSTYPE;

top.TARGETARCHITECTURE = top.ARCHITECTURE;

top.PATHSEPARATOR = top.getNativeFileSeparator();
top.STARTINGDIR = top.getStartingTopDir();
top.TOPDIR = path.normalize(top.STARTINGDIR+'..') + top.PATHSEPARATOR; //+ 'command';

top.tempDir = os.tmpdir();


if (typeof top.LOCALE == "undefined" || top.LOCALE == null)
{ 
	top.LOCALE = 'en';  //This is always en in March release, globalization won't be supported in this release
	//top.LOCALE = navigator.language;   
}
