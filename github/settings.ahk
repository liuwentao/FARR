#NoTrayIcon
#NoEnv
#SingleInstance force

IniRead, Login, ..\..\MyLocalData\GitHub\GitHub.ini, GitHub, login, %A_Space%
IniRead, Password,..\..\MyLocalData\GitHub\GitHub.ini, GitHub, password, %A_Space%

;Menu, Tray, Icon, GitHub.ico

Gui, Add, Text, section, Login :
Gui, Add, Text,, Password :
Gui, Add, Edit, ys W200 vLogin, %Login%
Gui, Add, Edit, Password W200 vPassword, %Password%

Gui, Add, Button, xm section default gOk, Ok
Gui, Add, Button, ys gCancel, Cancel

Gui, Show,, GitHub - Settings

goto End

Ok:
Gui, Submit,
FileCreateDir, ..\..\MyLocalData\GitHub
IniWrite, %Login%, ..\..\MyLocalData\GitHub\GitHub.ini, GitHub, login
IniWrite, %Password%, ..\..\MyLocalData\GitHub\GitHub.ini, GitHub, password
DetectHiddenWindows, On
PostMessage,0x400,0,0,,FScript/GitHub
Cancel:
GuiClose:
ExitApp


End:
