var self = require("sdk/self");
var data = require("sdk/self").data;
var file = require("sdk/io/file");
var panels = require("sdk/panel");
var tabs = require("sdk/tabs");
var { ToggleButton } = require('sdk/ui/button/toggle');

var button = ToggleButton({
    id: "list-tabs",
    label: "List Tabs",
    icon: "./icon-16.png",
    onClick: handleChange
});

var panel = panels.Panel({
    contentURL: data.url("panel.html"),
    contentScriptFile: [ // data.url('jquery-2.2.3.min.js'),
                        data.url("panel_script.js")],
    onHide: handleHide
});

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {checked: false});
}

function saveTabs() {
    ensureDirectory();
    writeTabData();
}

function writeTabData(){
    stream = file.open("~/browser-sessions/a-session.json", "w");
    stream.write(currentWindowTabData());
    stream.close();
}

function ensureDirectory() {
    if(!file.exists("~/browser-sessions")) {
        file.mkpath("~/browser-sessions");
    }
}

function currentWindowTabData(){
    var tabs_data = [];
    for (let tab of tabs) {
        tabs_data.push(tab.url);
    }

    return JSON.stringify(tabs_data, null, 2);
}
