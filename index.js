var self = require("sdk/self");
var file = require("sdk/io/file");
var tabs = require("sdk/tabs");

require("sdk/ui/button/action").ActionButton({
    id: "list-tabs",
    label: "List Tabs",
    icon: "./icon-16.png",
    onClick: saveTabs()
});

function saveTabs() {
    if(!file.exists("~/browser-sessions")) {
        file.mkpath("~/browser-sessions")
    }


    tabs_data = []
    for (let tab of tabs) {
        tabs_data.push(tab.url);
    }

    to_write = JSON.stringify(tabs_data, null, 2);

    stream = file.open("~/browser-sessions/a-session.json", "w");
    stream.write(to_write);
    stream.close();
}
