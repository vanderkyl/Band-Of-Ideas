var addedIdeas = 0;

function addToSong(id) {
  var data = new FormData();
  data.append('songId', CURRENT_SONG.id);
  data.append('fileId', id);
  data.append('bandId', CURRENT_BAND.id);
  data.append('userId', CURRENT_USER.id);
  var postData = {
    'songId': CURRENT_SONG.id,
    'fileId': id,
    'bandId': CURRENT_BAND.id,
    'userId': CURRENT_USER.id
  };

  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();

  } else {  // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      console.log("Success");
      console.log(this.ResponseText);
      hideElementById("ideaAddButton-" + id);
      displayElementById("ideaAdded-" + id);
      addedIdeas++;
    }
  }
  xmlhttp.open("POST","/php/addToSong.php", true);
  // set `Content-Type` header
  xmlhttp.setRequestHeader('Content-Type', 'application/json');
  xmlhttp.send(JSON.stringify(postData));
}
