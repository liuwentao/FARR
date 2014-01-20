// plugin script :
displayname = "Pm2.5察看";
versionstring = "1.0.0";
releasedatestring = "2014-01-20 11:29";
author = "liuwt";
updateurl = "";
homepageurl = "";
shortdescription = "PM2.5察看";
longdescription = "Pm2.5察看,可以察看部分城市的信息";
advconfigstring = "pm2.5";
readmestring = "pm2.5";
iconfilename = "icon.ico";

aliasstr = "pm";
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
// search state
STOPPED = 0;
SEARCHING = 1;

var alert;
var warn;
var fso = new ActiveXObject("Scripting.FileSystemObject");

function getTextFile(path) {
	var objFile = fso.GetFile(path);
	var objTS = objFile.OpenAsTextStream(1, 0);
	var txt = objTS.Read(objFile.Size);
	objTS.Close();
	return txt;
}

function onInit(directory) {
	// loading of hard Coded essential Extensions
	try {
		eval.call(null, getTextFile(directory + "\\Utils.js"));
		alert = Utils.alert;
	} catch (e) {
		FARR.setStrValue("DisplayAlertMessage", e.message);
	}
}

function onSearchBegin(querykey, explicit, queryraw, querynokeyword, modifier, triggermethod) {

try{
	if (!explicit) {
		if (aliasstr.indexOf(queryraw) != -1) {
			FARR.setState(querykey, 1);
			FARR.emitResult(querykey, aliasstr, aliasstr, iconfilename, ALIAS, IMMEDIATE_DISPLAY, 1000);
			FARR.setState(querykey, 0);
		}
		return;
	}
	
	var match = queryraw.match(new RegExp("^" + aliasstr + " (.+)\+o( |$)"));
	if (match && match[1]) {
		var city =match[1].substr(0, match[1].indexOf("+"));
		alert(city);
		FARR.setState(querykey, SEARCHING);
		Utils.doRequest("http://www.pm25.in/api/querys/pm2_5.json?city=" + encodeURI(city.trim()) + "&token=5j1znBVAsnSf5xQyNQyq", function (json) {
			if (json.error !== undefined) {
				alert("没有资源了");
			} else {
				for (var i = 0; i < json.length; i++) {
					FARR.emitResult(querykey, json[i].position_name + "PM2.5值：" + json[i].pm2_5 + " 等级：" + json[i].quality + ",观测地点:" + json[i].position_name, json[i].position_name, iconfilename, ALIAS, MATCH_AGAINST_SEARCH, 300);
				}
			}
		});
		FARR.setState(querykey, STOPPED);
	}

}catch(e){
	alert(e.message);
}

}

function onRegexSearchMatch(querykey, queryraw, querynokeyword) {
	return false;
}