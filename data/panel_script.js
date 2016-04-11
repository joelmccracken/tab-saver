// When the user hits return, send the "text-entered"
// message to main.js.
// The message payload is the contents of the edit box.

var windowNameText   = $('#window-name');
var previousSessions = $("#previous-sessions");

var saveButton       = $("#save-new");
var overwriteButton  = $("#overwrite");
var loadButton       = $("#load");

saveButton.on('click', function onClick(event) {
    self.port.emit('save-pressed', windowNameText.val());
});

overwriteButton.on('click', function onClick(event) {
    self.port.emit('overwrite-pressed', previousSessions.val());
});

loadButton.on('click', function onClick(event) {
    self.port.emit('load-pressed', previousSessions.val());
});

// Listen for the "show" event being sent from the
// main add-on code. It means that the panel's about
// to be shown.
self.port.on("show", function onShow() {
    windowNameText.focus();
});

self.port.on("panel-data", function panelDataSetter(panelData){
    setPreviousSessions(panelData.existingSessions);
    windowNameText.val(panelData.currentWindowName);
});

function setPreviousSessions(existingSessionNames) {
    console.log("existingSessionNames", existingSessionNames);
    let sessionOptions =
        existingSessionNames.map(function(sessionFilename){
            let match = sessionFilename.match(/(.*)\.json$/);
            if(match) {
                return match[1];
            } else {
                return null;
            }
        }).filter(function(item) { return item != null; })
        .map(function(sessionName){
            return "<option>" + sessionName + "</option>";
        });
    previousSessions.html("<option></option>" + sessionOptions);
}
