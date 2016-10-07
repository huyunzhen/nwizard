#define MyAppName "NWizard"
#define MyAppVersion "0.0.1-SNAPSHOT"
#define MyAppPublisher "Peiming Hu"
#define MyAppURL "http://xueba100.org"
#define LaunchProgram "Start NWizard"
#define DesktopIcon "Shortcut NWizard Desktop"
#define CreateDesktopIcon "Are you going to create a desktop icon?"

[Setup]
AppId={{B07719BE-BEE3-4B28-8063-27264487ABF0}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
DefaultGroupName={#MyAppName}
Compression=lzma
SolidCompression=yes
OutputDir=./bin/
OutputBaseFilename=nwizard-setup-{#MyAppVersion}

[Languages]
Name: "en"; MessagesFile: "compiler:Default.isl"
Name: "german"; MessagesFile: "compiler:Languages\German.isl"

[Files]
Source: "bin/nwizard/win64/*"; Excludes: "ffmpegsumo.dll,libEGL.dll,libGLESv2.dll" ; DestDir: "{app}"; Flags: ignoreversion recursesubdirs
Source: "app/favicon.png"; DestDir: "{app}"; DestName: "icon.ico"; Flags: ignoreversion

[Tasks]
Name: "desktopicon"; Description: "{#CreateDesktopIcon}"; GroupDescription: "{#DesktopIcon}"

[Icons]
Name: "{group}\NWizard"; Filename: "{app}\nwizard.exe"; WorkingDir: "{app}"; IconFilename: "{app}/icon.ico"
Name: "{userstartup}\NWizard"; Filename: "{app}\nwizard.exe"; WorkingDir: "{app}"; IconFilename: "{app}/icon.ico"
Name: "{userdesktop}\NWizard"; Filename: "{app}\nwizard.exe"; WorkingDir: "{app}"; IconFilename: "{app}/icon.ico"; Tasks: desktopicon

[Run]
Filename: "{app}\nwizard.exe"; WorkingDir: "{app}"; Description: {#LaunchProgram}; Flags: postinstall shellexec