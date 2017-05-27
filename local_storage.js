var storage = function(){
    var noteTemplate = function(newNote){
        return{
            'title': 'New Note',
            'Id': '',
            'content': [newNote]
        }
    }
    var appendNewNote = function(existingNote, newNote){
        for (var i = 0, len = existingNote.content.length; i < len; i++) {
            if(existingNote.content[i].url == newNote.url){
                existingNote.content[i].text += newNote.text;
                return existingNote;
            }
        }
        existingNote.content.push(newNote);
        return existingNote;
    }
    var isObjectEmpty = function(object)
    {
        if ('object' !== typeof object) {
            return true;
        }
    
        if (null === object) {
            return true;
        }

        if ('undefined' !== Object.keys) {
            // Using ECMAScript 5 feature.
            return (0 === Object.keys(object).length);
        } else {
            // Using legacy compatibility mode.
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }
    }
    var prepareNoteText = function(note){
        if(isObjectEmpty(note)){
             return{
                'title': 'New Note',
                'Id': '',
                'text': ''
            }
        }
        var noteText = '';
        for (var i = 0, len = note.note.content.length; i < len; i++) {
            noteText += note.note.content[i].url;
            noteText += "\n";
            noteText += note.note.content[i].text;
            noteText += "\n";
        }
        return{
            'title': note.note.title,
            'Id': note.note.Id,
            'text': noteText
        }
    }
    var saveNote = function(note){
        getNoteFromStorage(function(existingNote){
            var newNote = {};
            if(isObjectEmpty(existingNote)){
                newNote = new noteTemplate(note);
            }else{
                newNote = appendNewNote(existingNote.note, note);
            }
            saveNoteToStorage(newNote);
        })
    }
    var saveModifiedNote = function(note){
        if(!note){
            return;
        }
        saveNoteToStorage(note);
    }
    var getNote = function(callback){
        if(!callback){
            return null;
        }
        getNoteFromStorage(function(existingNotes){
            var noteObject = prepareNoteText(existingNotes)
            callback(noteObject);
        })
    }
    var getStorageNote = function(callback){
        if(!callback){
            return null;
        }
        getNoteFromStorage(function(existingNotes){
            if(isObjectEmpty(existingNotes)){
                return null;
            }
            callback(existingNotes.note);
        })
    }
    var getNoteFromStorage = function(callback){
            chrome.storage.local.get("note", function (obj) {
            callback(obj);
        });
    }
    var saveNoteToStorage = function(note){
        chrome.storage.local.set({'note': note}, function() {
          console.log('notes saved');
        });
    }
    var removeStorageData = function(){
        chrome.storage.local.clear();
    }
    return{
        SaveNote: saveNote,
        GetNote: getNote,
        GetStorageNote: getStorageNote,
        SaveModifiedNote: saveModifiedNote,
        RemoveStorageData: removeStorageData
    }
}()