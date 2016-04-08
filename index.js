var self = require("sdk/self");
var data = require("sdk/self").data;
var file = require("sdk/io/file");
var panels = require("sdk/panel");
var tabs = require("sdk/tabs");
var { ToggleButton } = require('sdk/ui/button/toggle');
const { identify } = require('sdk/ui/id');

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
    windowsToNames[identify(tabs.activeTab.window)] = saveName;
    writeTabData(saveName);
});

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: button
        });

        var panelData = {
            existingSessions:  readExistingSessions(),
            currentWindowName: windowsToNames[identify(tabs.activeTab.window)]
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

function saveTabs() {
    ensureDirectory();
    writeTabData();
}

function writeTabData(name){
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
    var tabs_data = [];
    for (let tab of tabs) {
        var extracted = {
            url: tab.url,
            title: tab.title
        };
        tabs_data.push(extracted);
    }

    return JSON.stringify(tabs_data, null, 2);
}
