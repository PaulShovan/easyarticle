var viewModel = {
    notes : ko.observableArray([]),
    selectedNote: ko.observable(),
    openSelectedNote: function(data){
        setSavedNoteToLocalStorage(data);
    }
}