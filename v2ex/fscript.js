// plugin script :
displayname = "V2EX list";
versionstring = "1.0.0";
releasedatestring = "Jan 1st, 2008";
author = "liuwt";
updateurl = "";
homepageurl = "";
shortdescription = "V2EX";
longdescription = "V2EX";
advconfigstring = "V2EX";
readmestring = "V2EX";
iconfilename = "v2ex.ico";

aliasstr = "v2ex";
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

	if (!explicit) {
		if (aliasstr.indexOf(queryraw) != -1) {
			FARR.setState(querykey, 1);
			FARR.emitResult(querykey, aliasstr, aliasstr, iconfilename, ALIAS, IMMEDIATE_DISPLAY, 1000);
			FARR.setState(querykey, 0);
		}
		return;
	}

	if (queryraw.match(/\+news( |$)/)) {
		FARR.setState(querykey, SEARCHING);
		Utils.doRequest("http://www.v2ex.com/api/topics/latest.json", function (json) {
			for (var i = 0; i < json.length; i++) {
				FARR.emitResult(querykey, json[i].title.substr(0, 20) + " @ " + json[i].node.title + " By " + json[i].member.username, json[i].url, iconfilename, URL, MATCH_AGAINST_SEARCH, 300);
			}
		});
		FARR.setState(querykey, STOPPED);
	} else {
		FARR.setState(querykey, 1);
		FARR.emitResult(querykey, "news", "v2ex +news ", iconfilename, URL, MATCH_AGAINST_SEARCH, 300);
		FARR.emitResult(querykey, "node", "v2ex +node ", iconfilename, URL, MATCH_AGAINST_SEARCH, 39);
		FARR.setState(querykey, 0);
	}


}

function onRegexSearchMatch(querykey, queryraw, querynokeyword) {
	return false;
}
