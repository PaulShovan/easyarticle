function downloadNote() {
  var text = document.getElementById('output').value;
  var title = document.getElementById('note-title').value;
  var a = document.getElementById("dload");
  var file = new Blob([text], {type: 'text/plain'});
  a.href = URL.createObjectURL(file);
  a.download = title+".txt";
  a.click();
}