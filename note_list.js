var viewModel = {
    notes : ko.observableArray([]),
    selectedNote: ko.observable(),
    openSelectedNote: function(data){
        setSavedNoteToLocalStorage(data);
    },
    deleteSelectedNote: function(data){
        if(data && data.Id){
            deleteNoteFromRemoteStorage(data);
        }
        return;
    }
}