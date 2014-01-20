// plugin script :
displayname = "o3o";
versionstring = "1.0.0";
releasedatestring = "2014-01-20 21:10";
author = "liuwt";
updateurl = "";
homepageurl = "";
shortdescription = "颜文字";
longdescription = "颜文字";
advconfigstring = "o3o";
readmestring = "o3o";
iconfilename = "icon.ico";

aliasstr = "o3o";
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

/**
* 访问接口
**/
function doRequest(querykey,url, r) {
	if (fso.FileExists(currentDirectory + "\\o3o.json")) {
		var o3oTxt = getTextFile(currentDirectory + "\\o3o.json");
		r(o3oTxt);
	} 
}

var currentDirectory;

function onInit(directory) {
	// loading of hard Coded essential Extensions
	try {
		currentDirectory = directory;
		eval.call(null, getTextFile(directory + "\\Utils.js"));
		alert = Utils.alert;
	} catch (e) {
		FARR.setStrValue("DisplayAlertMessage", e.message);
	}
}

function onSearchBegin(querykey, explicit, queryraw, querynokeyword, modifier, triggermethod) {

	try {
		if (!explicit) {
			if (aliasstr.indexOf(queryraw) != -1) {
				FARR.setState(querykey, 1);
				FARR.emitResult(querykey, aliasstr, aliasstr, iconfilename, ALIAS, IMMEDIATE_DISPLAY, 1000);
				FARR.setState(querykey, 0);
			}
			return;
		}
		if (queryraw.match(/\+alias( |$)/)) {
			FARR.setState(querykey, SEARCHING);
			doRequest(querykey,"https://raw.github.com/turingou/o3o/master/yan.json", function (json) {	
				    var list =JSON.parse(json);;
				alert(list.length);
				for (var i = 0; i < list.length; i++) {
					var yans = list[i].yan.split(',');
					for (var j = 0; j < yans.length; j++) {
						FARR.emitResult(querykey, list[i].tag + ":" + yans[j], yans[j], iconfilename, ALIAS, MATCH_AGAINST_SEARCH, 300);
					}
				}
			});
			FARR.setState(querykey, STOPPED);
		}


	} catch (e) {
		alert(e.message);
	}
}

function onRegexSearchMatch(querykey, queryraw, querynokeyword) {
	return false;
}