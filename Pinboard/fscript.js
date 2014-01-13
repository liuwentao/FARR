// plugin script :
displayname="Pinboard";
versionstring="1.0.0";
releasedatestring="Jan 12st, 2008";
author="liuwentao <liuwentao@gmail.com>";
updateurl="";
homepageurl="";
shortdescription="Pinboard";
longdescription="Pinboard";
advconfigstring="Pinboard";
readmestring="Pinboard";
iconfilename="Pinboard.ico";

aliasstr="pb";
regexstr="";
regexfilterstr="";
keywordstr="";
scorestr="300";

// type
UNKNOWN=0;
FILE=1;
FOLDER=2;
ALIAS=3;
URL=4;
PLUGIN=5;
CLIP=5;

// Postprocessing
IMMEDIATE_DISPLAY=0;
ADDSCORE=1;
MATCH_AGAINST_SEARCH=2;
Array.prototype.include=function(t) {
    for(var i=0;i<this.length;i++)
        if(this[i]==t)
            break;
    return i!=this.length;
}
Array.prototype.includeAll=function(ary) {
    for(var i=0;i<ary.length;i++)
        if(!this.include(ary[i]))
            return false;
    return true;
}
Array.prototype.map = function(callback,thisObject){
	for(var i=0,res=[],len=this.length;i<len;i++)
		res[i] = callback.call(thisObject,this[i],i,this);
	return res
}

var fso=new ActiveXObject("Scripting.FileSystemObject");

function error(txt) {
    FARR.setStrValue("DisplayBalloonMessage", txt);
    FARR.setStrValue("statusbar", txt);
    FARR.setStrValue("reporterror", txt);
}
function doRequest(querykey, url, r) {
    var xmlhttp=new ActiveXObject("MSXML2.XMLHTTP")
    xmlhttp.open("GET",url,true,username,password);
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4) {
            var xml = new ActiveXObject('Msxml2.DOMDocument');
            xml.resolveExternals=true;
            xml.async = false;

            xml.loadXML(xmlhttp.responseText);
            if(xml.parseError && xml.parseError.reason!="") {
                try {
                    error("Pinboard plugin : "+xmlhttp.responseText.match(/<title>(.*?)<\/title>/m)[1]);
                } catch(e) {
                    error("Pinboard plugin : "+xmlhttp.statusText);
                }
                FARR.setState(querykey,0);
                return;
            }
            r(xml);
        }
    }
    xmlhttp.send(null);
}

function doPublish(querykey, query, forceUpdate, cache, url, publish) {
    FARR.setState(querykey, 1);

    var postsDoc = new ActiveXObject('Msxml2.DOMDocument');
    postsDoc.load(currentDirectory+"\\"+cache)

    publish(300,postsDoc);
        
    if(!forceUpdate) {
        FARR.setState(querykey,0);        
        return;
    }

    FARR.notifyStateChange(querykey);

    doRequest(querykey, "https://api.pinboard.in/v1/posts/update?"+(new Date()).getTime(), function(update){
        updateDone=true;
        var lastUpdate="";
        if(update.selectSingleNode("update"))
            lastUpdate=update.selectSingleNode("update").getAttribute("time");

        var previousUpdate="";
        if(postsDoc.selectSingleNode("posts"))
            previousUpdate=postsDoc.selectSingleNode("posts").getAttribute("update");

        //FARR.emitResult(querykey,lastUpdate, "",iconfilename,ALIAS,IMMEDIATE_DISPLAY,1000);
        //FARR.emitResult(querykey,previousUpdate, "",iconfilename,ALIAS,IMMEDIATE_DISPLAY,1000);
        if(lastUpdate!=previousUpdate || previousUpdate=="") {
            doRequest(querykey, url+"?"+(new Date()).getTime(), function(posts) {
                postsDoc=posts;
                postsDoc.save(currentDirectory+"\\"+cache);
                publish(301,postsDoc);
                FARR.setState(querykey,0);
            });
        } else {
            FARR.setState(querykey,0);
        }
    });
}

username="";
password="";
function onOptionsChanged() {
    username=FARR.getIniValue("MyLocalData\\Pinboard\\Pinboard.ini", "Pinboard", "login");
    password=FARR.getIniValue("MyLocalData\\Pinboard\\Pinboard.ini", "Pinboard", "password");
}

function onInit(c) {
    currentDirectory=c;
}

function showOptions() {
    if(fso.FileExists("settings.exe"))
        FARR.exec("settings.exe", "", currentDirectory)
    else
        FARR.exec("settings.ahk", "", currentDirectory);
}

function onSearchBegin(querykey, explicit, queryraw, querynokeyword) {
    if(!explicit) {
        if(aliasstr.indexOf(queryraw)!=-1) {
            FARR.setState(querykey,1);
            FARR.emitResult(querykey,aliasstr, aliasstr, iconfilename,ALIAS,IMMEDIATE_DISPLAY,1000);
            FARR.setState(querykey,0);
        }
        return;
    }

    // no valid password ? reload it
    if(username=="" || password=="")
        onOptionsChanged();

    // still no valid password ? ask the user
    if(username=="" || password=="")
        showOptions();

    var noUpdate=queryraw.match(/\+nu( |$)/);
    var publishedTags={};
    var publishedPosts={};
    if(queryraw.match(/\+tags( |$)/)) {
        doPublish(querykey,queryraw, !noUpdate, "tags.xml", "https://api.pinboard.in/v1/tags/get", function(score, xml) {
            var tags=xml.selectNodes("//tag");
            for(var i=0;i<tags.length;i++) {
                var t=tags.item(i);
                if(typeof(publishedTags[t.getAttribute("tag")])=="undefined") {
                    publishedTags[t.getAttribute("tag")]=true;
                    FARR.emitResult(querykey, t.getAttribute("tag"), "pb +posts :"+t.getAttribute("tag"),iconfilename,URL,MATCH_AGAINST_SEARCH,parseInt(t.getAttribute("count")));
                }
            }
        });
    } else if(queryraw.match(/\+posts( |$)/)) {
        doPublish(querykey,queryraw, !noUpdate, "posts.xml", "https://api.pinboard.in/v1/posts/all", function(score, xml) {            
            var posts=xml.selectNodes("//post");
            for(var i=0;i<posts.length;i++) {
                var p=posts.item(i);
                var postTags=p.getAttribute("tag").split(" ").map(function(arg) { return ":"+arg; } );
                if(typeof(publishedPosts[p.getAttribute("href")])=="undefined") {
                    publishedPosts[p.getAttribute("href")]=true;
                    FARR.emitResult(querykey, p.getAttribute("description") + "  -->  " + postTags, p.getAttribute("href"),iconfilename,URL,MATCH_AGAINST_SEARCH,score);
                }
            }
        });
    } else {
        FARR.setState(querykey,1);
        FARR.emitResult(querykey, "posts", "pb +posts ",iconfilename,URL,MATCH_AGAINST_SEARCH,1000);
        FARR.emitResult(querykey, "tags", "pb +tags ",iconfilename,URL,MATCH_AGAINST_SEARCH,1000);
        FARR.setState(querykey,0);
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
