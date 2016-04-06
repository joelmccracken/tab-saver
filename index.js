var self = require("sdk/self");
var io_file = require("sdk/io/file");

require("sdk/ui/button/action").ActionButton({
    id: "list-tabs",
    label: "List Tabs",
    icon: "./icon-16.png",
    onClick: saveTabs()
});

function saveTabs() {
    // var tabs = require("sdk/tabs");
    // for (let tab of tabs)
    //     console.log(tab.url);
    console.log(io_file.read("~/.gitignore"))
    // JSON.stringify({foo: 10}, null, 2);
}
