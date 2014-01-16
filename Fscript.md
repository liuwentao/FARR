##FScript  FARR script SDK

###最快的开发方法
在fscript.js里面定义一个全局的函数`onSearchBegin`.先调用`FARR.setState(querykey,SEARCHING)`声明查询开始,然后把查询返回的结果放入到`FARR.emitResult`里面.最后调用`FARR.setState(querykey,STOPPED)`声明查询结束.
###插件安装
把`FScript.dll`复制到`Farr/plugins/sample/`目录里面.然后创建一个`fscript.js`然后拷贝如下的示例代码:
```javasciprt
{{{
// plugin script :
displayname="MyJavascriptPlugin";
versionstring="1.0.0";
releasedatestring="Jan 1st, 2008";
author="Author";
updateurl="";
homepageurl="";
shortdescription="MyJavascriptPlugin";
longdescription="MyJavascriptPlugin";
advconfigstring="MyJavascriptPlugin";
readmestring="MyJavascriptPlugin";
iconfilename="MyJavascriptPlugin.ico";

aliasstr="mjp";
regexstr="";
regexfilterstr="";
keywordstr="";
scorestr="300";

// type
UNKNOWN=0; FILE=1; FOLDER=2; ALIAS=3; URL=4; PLUGIN=5; CLIP=5;
// Postprocessing
IMMEDIATE_DISPLAY=0; ADDSCORE=1; MATCH_AGAINST_SEARCH=2;
// search state
STOPPED=0; SEARCHING=1;

function onSearchBegin(querykey, explicit, queryraw, querynokeyword) {    
    if(!explicit) {
        return;
    }

    FARR.setState(querykey,SEARCHING);                                                            // before emitResult set state to searching
    FARR.emitResult(querykey,"Hello", "Hello", iconfilename,UNKNOWN,IMMEDIATE_DISPLAY,1000);    // emit one result
    FARR.setState(querykey,STOPPED);                                                            // when done set state to stopped
}
}}}
```
修改其中的全局变量,`displayname`, `version`, `author`.这些值最终会显示在 `FARR`的插件列表中.

###FARR global object

#### FARR.emitResult(querykey, title, path, icon, entrytype=FILE, resultpostprocessing=2, score=300);
 添加查询结果到`FARR`中
#### FARR.setState(querykey, s)
在开始搜索之前需要设定状态为`SEARCHING`,在搜索完成以后需要设定状态为`STOPPED`
#### FARR.notifyStateChange(querykey)
如果想把结果显示出来的话,可以调用`notifyStateChange`(这个要看几率了...)
#### FARR.setStrValue(command, value)
对`FARR`设定一些特殊的操作,如修改状态栏,设定`richedit`.(可以参考`FARR`的`plugin action`部分的文档)
#### FARR.getStrValue(command, value)

获得FARR内部的参数:

* Version.FARR (2.xx.xx style)
* Version.FARR_PLUGINAPI (1.xx.xx style)
* Version.FARR_PLUGINAPI_RELEASENUM (# style) <-- empty before V3. 

#### FARR.debug(txt)
弹出一个消息框,用来提示调试信息.类似于`javascript`中的`alert`.
#### FARR.setInterval(id, millisecond, pFunc)
设置定时任务,事件发生的间隔,`pFunc`为回调函数
#### FARR.killInterval(id);
停止定时任务
#### FARR.showOptions()
显示参数配置
#### FARR.exec(file,parameters,currentdirectory)
执行某些命令
#### FARR.getIniValue(file,section,value,def)
获取ini的值

###Available callbacks

`javascript SDK`会调用以下的函数,不需要全部都定义.如果有需要的话,才定义.
偷懒的话,只定义用到的就可以了.

####onInit(currentDirectory)
called when the plugin start. Initialisations can be done here. If you need the directory of the plugin you can get it here.
{{{onSearchBegin(querykey, explicit, queryraw, querynokeyword)}}}
onSearchBegin is called whenever a search begin.
* querykey is the key of the search, you must specify it unchanged when calling FARR.emitResult, FARR.setState or FARR.notifyStateChange
* explicit is true if the alias match.
* queryraw is the query with alias
* querynokeyword is the query without alias
* modifierstring
* triggermethod
####onRegexSearchMatch(querykey, queryraw, querynokeyword)
onRegexSearchMatch is called whever a search match the regexfilter (this is useful if you want that FARR filter your results based on another part than the end of the query )
* querykey is the key of the search, you must specify it unchanged when calling FARR.emitResult, FARR.setState or FARR.notifyStateChange
* queryraw is the query with alias
* querynokeyword is the query without alias
* modifierstring
* triggermethod
remark : onRegexSearchMatch is always explicit
####onProcessTrigger(title,path)
define onProcessTrigger if you want to do something special on a result
* returning true mean you handled the action (FARR will not launch default action )
* returning 1 mean you handled the action (FARR will not launch default action )
* returning 2 mean close the FARR window
1 and 2 are flags, you can return 1&2 for handled and close
####onOptionsChanged()
define onOptionsChanged to know when the internal options have completed
####onDoAdvConfig()
define onDoAdvConfig to show your custom options UI when the advanced options button is pressed * experimental *
####onReceiveKey(Key, altpressed, controlpressed, shiftpressed)
onReceiveKey is called when a special key like enter is pressed in memo mode. (entered with setStrValue("window.richeditmode", "text" )
####onIdleTime(idleTime)
onIdleTime is called when more than 500ms idle elapsed in memo mode
####onSetStrValue
called when FARR set a value
####onGetStrValue
called when FARR want a value from the plugin

###Commands callables by plugin

launch, LAUNCHFILENAME (launch can be use to run command too like : htmlviewurl, dosearch ? )
statusbar, TEXTTOSETONSTATUSBAR
setsearch, TEXTTOSETINSEARCHEDIT
setsearchnogo, TEXTTOSETINSEARCHEDIT
stopsearch
window.hide
window.show
window.toggle
window.richeditmode, TEXTOPUTINRICHEDITWINDOW
window.richeditheight, HEIGHTOFWINDOW
window.richeditwidth, WIDTHOFWINDOW
setshowallmode
exit
reporterror, ERRORTEXTTOREPORTINPLUGINLOG
clipboard
DisplayAlertMessage, TITLEnTEXT FOR ALERT BOX
DisplayAlertMessageNoTimeout, TITLEnTEXT FOR ALERT BOX
DisplayBalloonMessage,TITLEnTEXT FOR BALLOON TEXT

###Useful objects

* `MSXML2.DOMDocument` : to read xml
* `MSXML2.XMLHttpRequest` : to make requests
* `WScript.Shell` : to run programs and other things
* `Scripting.FileSystemObject` : to read and write files

###调试

Debugging can be improved by installing the microsoft javascript debugger and setting the DWORDs :

* `HKEY_CURRENT_USER\Software\Microsoft\Windows Script\Settings\JITDebug=1`
* `HKEY_CURRENT_USER\Software\Microsoft\Windows Script Host\Settings\JITDebug=1`

in the registry base.

###querykey
The querykey is the mean to say to the Javascript SDK which request you are currently responding to. This is a number that change at each request. You must give it back unchanged when calling emitResult or setState. This allow results to not mix between differents request. This is useful when you plugin does asynchronous search (like network requests ).
You don't have to really care about it : just give it back unchanged to the methods that need it.
The programmer decide you have to just to bug you. It can't be that easy :)