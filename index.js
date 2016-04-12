var self = require("sdk/self");
var data = require("sdk/self").data;
var file = require("sdk/io/file");
var panels = require("sdk/panel");
var tabs = require("sdk/tabs");
var windows = require("sdk/windows").browserWindows;
var { ToggleButton } = require('sdk/ui/button/toggle');
const { identify } = require('sdk/ui/id');
var { setTimeout } = require("sdk/timers");
var child_process = require("sdk/system/child_process");

var windowsToNames = {};

const browserSessionsPath = "~/browser-sessions";

var button = ToggleButton({
    id: "list-tabs",
    label: "List Tabs",
    icon: "./icon-16.png",
    onClick: handleChange
});

var panel = panels.Panel({
    contentURL: data.url("panel.html"),
    contentScriptFile: [ data.url('jquery-2.2.3.js'),
                        data.url("panel_script.js")],
    onHide: handleHide
});

panel.port.on("save-pressed", function(saveName){
    saveNameForCurrentWindow(saveName);
    writeCurrentWindowTabData(saveName);
    commitSessionChanges(saveName);
});

panel.port.on("overwrite-pressed", function(saveName){
    saveNameForCurrentWindow(saveName);
    writeCurrentWindowTabData(saveName);
    commitSessionChanges(saveName);
});

panel.port.on("load-pressed", function(saveName){
    if(saveName != "") {
        loadSavedSession(saveName);
    }
});


function saveNameForCurrentWindow(name) {
    windowsToNames[identify(tabs.activeTab.window)] = name;
}
function getNameForCurrentWindow() {
    return windowsToNames[identify(tabs.activeTab.window)];
}


function loadSavedSession(saveName) {
    let content = file.read(browserSessionsPath + "/" + saveName + ".json");
    let parsed = JSON.parse(content);
    let urls = parsed.map(item => item.url);

    tabsetOpener(saveName, urls);
}

function tabsetOpener(windowName, tabsList) {
    let firstPage = tabsList[0];
    let remainingPages = tabsList.slice(1);

    var initialPromise = new Promise(function(resolve, reject){
        windows.open({
            url: firstPage || "about:home",
            onOpen: function(window) {
                slightDefer(resolve);
                saveNameForCurrentWindow(windowName);
            }
        });
    });

    remainingPages.reduce(
        function(previous, current){
            return previous.then(function(){
                return new Promise(function(resolve, reject){
                    tabs.open(
                        {
                            url: current,
                            onOpen: function(tab){
                                slightDefer(resolve);
                            }
                        });
                });
            });
        }, initialPromise);
}

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: button
        });

        var panelData = {
            existingSessions:  readExistingSessions(),
            currentWindowName: getNameForCurrentWindow()
        };

        panel.port.emit('panel-data', panelData);
    }
}

function readExistingSessions() {
    return file.list(browserSessionsPath);
}

function handleHide() {
    button.state('window', {checked: false});
}

function writeCurrentWindowTabData(name){
    stream = file.open(browserSessionsPath + "/" +name+".json", "w");
    stream.write(currentWindowTabData());
    stream.close();
}

function ensureDirectory() {
    if(!file.exists(browserSessionsPath)) {
        file.mkpath(browserSessionsPath);
    }
}

function currentWindowTabData(){
    let currentWindowTabs = tabs.activeTab.window.tabs;

    var tabs_data = [];
    for (let tab of currentWindowTabs) {
        var extracted = {
            url: tab.url,
            title: tab.title
        };
        tabs_data.push(extracted);
    }
    return JSON.stringify(tabs_data, null, 2);
}

function slightDefer(fn){
    setTimeout(fn, 200);
}

function commitSessionChanges(sessionName){
    let cwd = expandPath(browserSessionsPath );
    var git_add = child_process.spawn('/usr/local/bin/git', ['add', '.'], { cwd: cwd });
    git_add.on('close', function(){
        child_process.spawn('/usr/local/bin/git', ['commit', '-m', sessionName], { cwd: cwd });
    });
}


function expandPath(path) {
    return file.join(path, "");
}
