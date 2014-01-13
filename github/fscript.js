// plugin script :
displayname = "GitHub";
versionstring = "1.0.0";
releasedatestring = "2014-01-12 21:33";
author = "liuwentao <liuwentao@gmail.com>";
updateurl = "";
homepageurl = "http://wentao.org";
shortdescription = "GitHub";
longdescription = "script for github";
advconfigstring = "GitHub";
readmestring = "GitHub";
iconfilename = "GitHub.ico";

aliasstr = "git";
regexstr = "";
regexfilterstr = "";
keywordstr = "";
scorestr = "300";

// type
UNKNOWN = 0;
FILE = 1;
FOLDER = 2;
ALIAS = 3;
URL = 4;
PLUGIN = 5;
CLIP = 5;

// Postprocessing
IMMEDIATE_DISPLAY = 0;
ADDSCORE = 1;
MATCH_AGAINST_SEARCH = 2;

username = "";
password = "";
var fso = new ActiveXObject("Scripting.FileSystemObject");
var alert;
/**
* 记录异常信息
**/
function error(txt) {
	FARR.setStrValue("DisplayBalloonMessage", txt);
	FARR.setStrValue("statusbar", txt);
	FARR.setStrValue("reporterror", txt);
}

/**
* 访问接口
**/
function doRequest(querykey, url, r) {
	var xmlhttp = new ActiveXObject("MSXML2.XMLHTTP")
	xmlhttp.open("GET", url, true, username, password);
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4) {
			r(xmlhttp.responseText);
		}
	}
	xmlhttp.send(null);
}


/**
* 更新检索的结果
**/
function doPublish(querykey, query, forceUpdate, cache, url, publish) {
	try {
		
		FARR.setState(querykey, 1);
		if (fso.FileExists(currentDirectory + "\\" + cache)) {

			if (!forceUpdate) {
				var txt = getTextFile(currentDirectory + "\\" + cache);
				publish(300, getTextFile(currentDirectory + "\\" + cache));
				FARR.setState(querykey, 0);
				return;
			}
		}
		FARR.notifyStateChange(querykey);
		doRequest(querykey, url, function (update) {
			try {
				if (fso.FileExists(currentDirectory + "\\" + cache)) {
					var f = fso.OpenTextFile(currentDirectory + "\\" + cache, 2, false);
				} else {
					var f = fso.OpenTextFile(currentDirectory + "\\" + cache, 2, true);
				}
				f.Write(update);
			} catch (e) {
				//alert(e.message);
			}
			publish(301, update);
			FARR.setState(querykey, 0);
		});
	} catch (e) {
		//alert(e.message);
	}
}


/**
* 重新加载用户名和密码
**/
function onOptionsChanged() {
	username = FARR.getIniValue("MyLocalData\\GitHub\\GitHub.ini", "GitHub", "login");
	password = FARR.getIniValue("MyLocalData\\GitHub\\GitHub.ini", "GitHub", "password");
}

/**
* 获得文件内容
**/
function getTextFile(path) {
	var objFile = fso.GetFile(path);
	var objTS = objFile.OpenAsTextStream(1, 0);
	var txt = objTS.Read(objFile.Size);
	objTS.Close();
	return txt;
}

/**
* FARR初始化,该函数在脚本加载的时候
**/
function onInit(c) {
	currentDirectory = c;
	try {
		eval.call(null, getTextFile(c + "\\Utils.js"));
		alert = Utils.alert;
	} catch (e) {
		FARR.setStrValue("DisplayAlertMessage", e.message);
	}
}

/**
* 打开配置界面
**/
function showOptions() {
	if (fso.FileExists("settings.exe")) FARR.exec("settings.exe", "", currentDirectory)
	else FARR.exec("settings.ahk", "", currentDirectory);
}

/**
* 在FARR开始搜索时候的处理
**/
function onSearchBegin(querykey, explicit, queryraw, querynokeyword) {
	if (!explicit) {
		if (aliasstr.indexOf(queryraw) != -1) {
			FARR.setState(querykey, 1);
			FARR.emitResult(querykey, aliasstr, aliasstr, iconfilename, ALIAS, IMMEDIATE_DISPLAY, 1000);
			FARR.setState(querykey, 0);
		}
		return;
	}


	// 如果没有密码,先尝试重新读取
	if (username == "" || password == "") onOptionsChanged();

	// 提醒用户配置用户名和密码
	if (username == "" || password == "") showOptions();

	var noUpdate = queryraw.match(/\+nu( |$)/);
	var publishedTags = {};
	var publishedPosts = {};
	if (queryraw.match(/\+star( |$)/)) {
		doPublish(querykey, queryraw, !noUpdate, "star.json", "https://api.github.com/users/"+ username +"/starred", function (score, xml) {
			var data = JSON.parse(xml);
			for (var i = 0; i < data.length; i++) {
				FARR.emitResult(querykey, data[i].name, data[i].html_url, iconfilename, URL, MATCH_AGAINST_SEARCH, score);
			}
		});
	} else if (queryraw.match(/\+repo( |$)/)) {
		doPublish(querykey, queryraw, !noUpdate, "repo.xml", "https://api.GitHub.in/v1/posts/all", function (score, xml) {
			alert(xml);
		});
	} else {
		FARR.setState(querykey, 1);
		FARR.emitResult(querykey, "github", "git +star 显示所有的加星repo ", iconfilename, URL, MATCH_AGAINST_SEARCH, 1000);
		FARR.emitResult(querykey, "tags", "pb +tags ", iconfilename, URL, MATCH_AGAINST_SEARCH, 1000);
		FARR.setState(querykey, 0);
	}
}

function onRegexSearchMatch(querykey, queryraw, querynokeyword) {
	return false;
}

function onProcessTrigger() {
	return false;
}

function onDoAdvConfig() {
	showOptions();
	return true;
}