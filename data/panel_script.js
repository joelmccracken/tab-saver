// When the user hits return, send the "text-entered"
// message to main.js.
// The message payload is the contents of the edit box.


var windowNameText   = $('#window-name');
var saveButton       = $("#save-new");
var previousSessions = $("#previous-sessions");
var overwriteButton  = $("#overwrite");
var loadButton       = $("#load");

saveButton.on('click', function onClick(event) {
    self.port.emit('save-pressed', windowNameText.val());
    // $(windowNameText).hide();
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
    sessionOptions =
        existingSessionNames.map(function(sessionFilename){
            return sessionFilename.match(/(.*)\.json$/)[1];
        }).map(function(sessionName){
            return "<option>" + sessionName + "</option>";
        });
    previousSessions.html("<option></option>" + sessionOptions);
}
