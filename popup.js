function getClassifiedContents(str){
    var contents = [];
    var urls = str.match(/\bhttps?:\/\/\S+/gi);
    console.log(urls);
    if(!urls || urls.length < 1){
        contents.push({
                'url': '',
                'text': str.trim()
            })
        return{
            'title': document.getElementById('note-title').value,
            'Id': '',
            'content': contents
        }
    }
    for (var i = 0, len = urls.length; i < len; i++) {
        if(i == 0 && str.indexOf(urls[i]) != 0){
            var url = '';
            var text = str.substring(0, str.indexOf(urls[i]));
            contents.push({
                'url': url,
                'text': text.trim()
            })
        }
        if(urls[i+1]){
            var text = str.substring(str.indexOf(urls[i]) + urls[i].length, str.indexOf(urls[i+1]));
            contents.push({
                'url': urls[i],
                'text': text.trim()
            })
        }
        else{
            var text = str.substring(str.indexOf(urls[i]) + urls[i].length, str.length);
            contents.push({
                'url': urls[i],
                'text': text.trim()
            })
        }
    }
    console.log(contents);
    return{
        'title': document.getElementById('note-title').value,
        'Id': document.getElementById('note-id').value,
        'content': contents
    }
}
function updateNote(){
    var text = document.getElementById('output').value;
    var notes = getClassifiedContents(text);
    chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.saveModifiedNotes(notes);
    });
}
function saveNote(){
    chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.getStorageNote(storageNoteReceived);
    });
}
function removeLocalStorageDate(){
    chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.removeLocalStorageData();
    });
}
function setSavedNoteToLocalStorage(note){
    chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.saveModifiedNotes(note);
        document.getElementById('editor-tab').click();
    });
}
function storageNoteReceived(note){
    if(note == null){
        alert("Nothing to save");
    }
    var savedDone = firebaseStorage.SaveNote(note);
    if(savedDone){
        removeLocalStorageDate();
        document.getElementById('editor-tab').click();
    }
}
function deleteNoteFromRemoteStorage(note){
    var deleteDone = firebaseStorage.DeleteData(note);
    if(deleteDone){
        getNotes();
    }
}
function getNotes(){
    firebaseStorage.GetNotes(function(notes){
        viewModel.notes(notes);
    });
}
function onPageDetailsReceived(details) {
	document.getElementById('output').value = details.text;
    document.getElementById('note-title').value = details.title;
    document.getElementById('note-id').value = details.Id;
}
function getNoteForEdit(){
    chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.getPageDetails(onPageDetailsReceived);
    });
}
window.addEventListener('load', function(evt) {
    document.getElementById("update").onclick = updateNote;
    document.getElementById("save").onclick = saveNote;
    document.getElementById("note-tab").onclick = getNotes;
    document.getElementById("editor-tab").onclick = getNoteForEdit;
    document.getElementById("download").onclick = downloadNote;
    getNoteForEdit();
    ko.applyBindings(viewModel);
});
