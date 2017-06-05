// This function is called onload in the popup code
function getPageDetails(callback) {
    storage.GetNote(callback);
};
function getStorageNote(callback) {
    storage.GetStorageNote(callback);
};
function removeLocalStorageData(){
  storage.RemoveStorageData();
}
function saveModifiedNotes(note){
  storage.SaveModifiedNote(note)
}

function addSelectedText(sText, url, title){
    var info = {
    'url': url,
    'text': sText,
  }
  storage.SaveNote(info, title);
}

function onClickHandler(info, tab) {
  addSelectedText(info.selectionText, info.pageUrl, tab.title);
};
chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Take Note";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});
});
