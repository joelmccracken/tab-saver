// When the user hits return, send the "text-entered"
// message to main.js.
// The message payload is the contents of the edit box.


var windowNameText = document.getElementById('window-name');
var saveButton     = document.getElementById('save');

saveButton.addEventListener('click', function onclick(event){
    alert(windowNameText.value());
}, false);


// Listen for the "show" event being sent from the
// main add-on code. It means that the panel's about
// to be shown.
//
// Set the focus to the text area so the user can
// just start typing.
self.port.on("show", function onShow() {
    textArea.focus();
});
