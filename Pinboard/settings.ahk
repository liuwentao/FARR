#NoTrayIcon
#NoEnv
#SingleInstance force

IniRead, Login, ..\..\MyLocalData\Pinboard\Pinboard.ini, Pinboard, login, %A_Space%
IniRead, Password,..\..\MyLocalData\Pinboard\Pinboard.ini, Pinboard, password, %A_Space%

;Menu, Tray, Icon, Pinboard.ico

Gui, Add, Text, section, Login :
Gui, Add, Text,, Password :
Gui, Add, Edit, ys W200 vLogin, %Login%
Gui, Add, Edit, Password W200 vPassword, %Password%

Gui, Add, Button, xm section default gOk, Ok
Gui, Add, Button, ys gCancel, Cancel

Gui, Show,, Pinboard - Settings

goto End

Ok:
Gui, Submit,
FileCreateDir, ..\..\MyLocalData\Pinboard
IniWrite, %Login%, ..\..\MyLocalData\Pinboard\Pinboard.ini, Pinboard, login
IniWrite, %Password%, ..\..\MyLocalData\Pinboard\Pinboard.ini, Pinboard, password
DetectHiddenWindows, On
PostMessage,0x400,0,0,,FScript/Pinboard
Cancel:
GuiClose:
ExitApp


End:
