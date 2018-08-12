<template>
  <div id="main-page">
    <!-- Navber / Player -->
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="navbar-brand" id="home">Tempo Web</div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
          <button id="playRandom">Play Random</button>
          <div id="playerHolder">
            <audio controls></audio>
            <div class="controls">
              <button class="back control-button" data-icon="B" aria-label="rewind"></button>
              <button class="play control-button" data-icon="P" aria-label="play pause toggle"></button>
              <button class="stop control-button" data-icon="S" aria-label="stop"></button>
              <button class="next control-button" data-icon="F" aria-label="fast forward"></button>
              <div class="timer">
                <div></div>
                <span aria-label="timer">00:00</span>
              </div>
            </div>
          </div>
        </ul>
        <!--<form class="form-inline mt-2 mt-md-0">
          <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>-->
      </div>
    </nav>
    <!-- End Nav/Player -->
    <h1 id="typeLable">Artists</h1>
    <div id="main"></div>
  </div>
</template>

<script>
var audioPlayer = new Audio();
var baseURL = "http://www.chilltec.net:8000";
var songSet = []; /*List of songs in the current playing set*/
var curSong = -1; /*ID of the currently playing song*/
var nextSong = -1; /*ID of next song to be played from the current playing set*/
var prevSet = []; /*Stores the last played songs for the 'back' button*/
var browsingSongSet = []; /*List of songs in the current browsing set*/

/*Stores the 'artists' table from the database. Structure:
  [id], [artist], [numSongs], [numAlbums], [picture]*/
var artistsDB = [];

/*Stores the 'albums' table from the database. Structure:
  [id], [artist] [album], [numSongs], [albumArt]*/
var albumsDB = [];

/*Stores the 'songs' table from the database. Structure:
  [artist], [album], [title], [fileType], [directory], [id]*/
var songsDB = [];

export default {
  name: 'tempoWeb',
  methods: {
    playSong(src){
      audioPlayer.pause();
      audioPlayer.src = src;
      audioPlayer.load();
      audioPlayer.play();

    },
    playSongById(songID){
      //Used when clicking a song link
      var songSetIndex = songSet.indexOf(parseInt(songID));
      if(songSet.length >= (songSetIndex + 1)){ 
        nextSong = songSet[songSetIndex + 1]; //songID, if it exists
      }
      else{
        nextSong = -1; //Otherwise, set to -1
      }
      console.log("Next song: " + nextSong);
      audioPlayer.pause();
      audioPlayer.src = baseURL + "/getSongById/" + songID;
      audioPlayer.load();
      audioPlayer.play();
      console.log("Playing: " + songID);
      curSong = parseInt(songID);
    },
    
    playRandomSongByArtist(artist){
      src = baseURL + "/getRandomSongByArtist/" + artist 
    },
    control_play(play_button){
      if(audioPlayer.paused) {
        play_button.setAttribute('data-icon', 'u');
        audioPlayer.play();
      }
      else{
        play_button.setAttribute('data-icon', 'P');
        audioPlayer.pause();
      }
    },
    control_stop(play_button){
      play_button.setAttribute('data-icon', 'P');
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    },
    control_next(){
      var toPlay = nextSong;
      console.log("Playing: " + toPlay);
      var songSetIndex = songSet.indexOf(parseInt(toPlay));
      if(toPlay !== -1){
        if(songSet.length >= (songSetIndex + 1)){ 
          nextSong = songSet[songSetIndex + 1]; //songID, if it exists
        }
        else{
          nextSong = -1; //Otherwise, set to -1
        }
        console.log("Next up: " + nextSong);
        this.playSong(baseURL + "/getSongById/" + toPlay);
        curSong = parseInt(toPlay);
      }
      else{
        console.log("Hit end of queue");
      }
    },
    control_back(){
      if(audioPlayer.currentTime >= 3){
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        return;
      }
      var songSetIndex = songSet.indexOf(parseInt(curSong));
      if(songSetIndex - 1 >= 0 && songSetIndex - 1 <= songSet.length){
        nextSong = curSong;
        var toPlay = songSet[songSetIndex - 1];
        this.playSong(baseURL + "/getSongById/" + toPlay);
        curSong = parseInt(toPlay);
        console.log("Playing: " + toPlay);
        console.log("Up next: " + nextSong);
      }
    },
    updatePlayerTime(timeHolder, timeBar, timer){
      var min = Math.floor(audioPlayer.currentTime / 60); //Min/Sec set by user
      var sec = Math.floor(audioPlayer.currentTime - min * 60);
      var newMin;     //To build the updated display
      var newSec;
      var newTime;    //To update the display
      var barLength;  //The time bar
      if(min < 10){
        newMin = '0' + min;
      }
      else{
        newMin = min;
      }
      if(sec < 10){
        newSec = '0' + sec;
      }
      else{
        newSec = sec;
      }
      newTime = newMin + ':' + newSec;
      timer.textContent = newTime;
      barLength = timeHolder.clientWidth * (audioPlayer.currentTime / audioPlayer.duration);
      timeBar.style.width = barLength + 'px';
    },
    getDBTables(cb){
      /*Gets the contents of the 'artists', 'albums', and 'songs' tables
        from the database and stores them for local use.*/
      this.$http.get(baseURL + "/getArtists").then(response_ar => {
        artistsDB = response_ar.body;
        this.$http.get(baseURL + "/getAlbums").then(response_al => {
          albumsDB = response_al.body;
          this.$http.get(baseURL + "/getSongs").then(response_so => {
            songsDB = response_so.body;
            cb();
          }, response_so => { console.log("Error: " + response_so.body); });
        }, response_al => { console.log("Error: " + response_al.body); });
      }, response_ar => { console.log("Error: " + response_ar.body); });
    },
    writeArtists(cb, width=8){
      /*Writes information for all artists on the main page. 'Width' denotes
      the maximum number of artists to display in one row on larger screens.*/
      if(songsDB === []){
        console.log("Error: Calling writeArtists() before getSongs()");
        return;
      }
      document.getElementById("typeLable").innerHTML = "Artists";
      var numArtists = artistsDB.length;
      var html = '<div class="container">'
      for(var i = 0; i < numArtists; i++){
        if(i % width === 0 && i !== 0){
          html += '</div>';
        }
        if(i % width === 0){
          html += '<div class="row">';
        }
        html += '<div class="col-sm artistLink" tag=ArID_' +
          artistsDB[i].id + '>' +
          artistsDB[i].artist.toString() + '</div>';
      }
      html += '</div>';
      document.getElementById("main").innerHTML = html;
      cb();
    },
    writeArtistPage(artistID, cb, width=8){
      /*Writes information for a single artist, givin its artist ID.
      Includes albums, songs, and additional information*/
      var albums = [];
      for(var i=0; i < albumsDB.length; i++){
        if(albumsDB[i].artist == artistID){
          albums.push(albumsDB[i]);
        }
      }
      document.getElementById("typeLable").innerHTML = artistsDB[artistID - 1].artist;
      var html = '<div class="container">'
      html += '<div class="row"><div class="col-sm albumLink" tag="AlID_0">'
      + 'All Songs</div>'; 
      for(var i=0; i < albums.length; i++){
        if((i+1) % width === 0 && i !== 0){
          html += '</div>';
        }
        if((i+1) % width === 0 && i !== 0){
          html += '<div class="row">';
        }
        html += '<div class="col-sm albumLink" tag=AlID_' +
        albums[i].id + '>' +
          albums[i].album.toString() + '</div>';
      }
      html += '</div>';
      document.getElementById('main').innerHTML = html;
      cb()
    },
    writeAlbumPage(albumID, artistID, cb, width=1) {
    //Writes all songs in album
      var songs = [];
      // browsingSongSet = [] //Clear the browsing set
      if(albumID === 0) {
        //For "All Songs" link
        for(var i=0; i < songsDB.length; i++){
          if(songsDB[i].artist === artistID){
            songs.push(songsDB[i])
            browsingSongSet.push(songsDB[i].id);
          }
        }
        document.getElementById("typeLable").innerHTML = artistsDB[artistID-1].artist;
      }
      else{
        //For individual album links
        for(var i=0; i < songsDB.length; i++){
          if(songsDB[i].album == albumID) {
            songs.push(songsDB[i]);
            browsingSongSet.push(songsDB[i].id);
          }
        }
        document.getElementById("typeLable").innerHTML = albumsDB[albumID - 1].album;
      }
      var html = '<div class="container">';
      for(var i=0; i < songs.length; i++){
        if(i % width === 0 && i !== 0){
          html += '</div>';
        }
        if(i % width === 0){
          html += '<div class="row">';
        }
        html += '<div class="col-sm songLink" tag=SoID_' +
        songs[i].id + '>' +
          songs[i].title.toString() + '</div>';
      }
      html += '</div>';
      document.getElementById('main').innerHTML = html;
      cb();
    },
    playRandom(){
      var src = baseURL + "/getRandomSong?time=" + Date.now()
      this.playSong(src);
    },
    createArtistListeners(){
      var tempoWeb = this; //Holds 'tempoWeb' location through the callback
      var artistLinks = document.getElementsByClassName("artistLink");
      for(var i=0; i < artistLinks.length; i++){
        var artistLink = artistLinks[i];
        artistLink.addEventListener('click', function() {
          var artistID = this.attributes.tag.nodeValue.split('ArID_')[1];
          tempoWeb.writeArtistPage(artistID, tempoWeb.createAlbumListeners);
        });
      }
    },
    createAlbumListeners(){
      var tempoWeb = this;
      var albumLinks = document.getElementsByClassName("albumLink");
      var lastAlbum = albumLinks[albumLinks.length - 1].attributes.tag.nodeValue.split('AlID_')[1];
      this.$http.get(baseURL + "/getArtistByAlbum/" + lastAlbum).then(response => {
        var artistID = parseInt(response.body);
        for(var i=0; i < albumLinks.length; i++){
          var albumLink = albumLinks[i]
          albumLink.addEventListener('click', function() {
            var albumID = parseInt(this.attributes.tag.nodeValue.split('AlID_')[1]);
            tempoWeb.writeAlbumPage(albumID, artistID, tempoWeb.createSongListeners);
          });
        }
      }, response => { console.log("Error: " + response.body);});
    },
    createSongListeners(){
      var tempoWeb = this;
      var songLinks = document.getElementsByClassName("songLink");
      for(var i=0; i < songLinks.length; i++) {
        var songLink = songLinks[i];
        songLink.addEventListener('click', function() {
          console.log("Got here");
          songSet = browsingSongSet.slice();
          var songId = this.attributes.tag.nodeValue.split('SoID_')[1];
          tempoWeb.playSongById(songId);
        });
      }
    },
  },
  mounted: function() {
    var tempoWeb = this;
    tempoWeb.getDBTables(function() {
      tempoWeb.writeArtists(tempoWeb.createArtistListeners);
      //tempoWeb.writeArtistPage(39);
    });
    document.getElementById("playRandom").onclick = function(){tempoWeb.playRandom();};
    document.getElementById("home").onclick = function(){
      tempoWeb.writeArtists(tempoWeb.createArtistListeners);
    };

    audioPlayer.addEventListener('ended', function(){
      tempoWeb.control_next();
    });
    
    //Player
    var audioHolder = document.querySelector('audio');
    var controller = document.querySelector('.controls');
    var controller_play = document.querySelector('.play');
    var controller_stop = document.querySelector('.stop');
    var controller_next = document.querySelector('.next');
    var controller_back = document.querySelector('.back');
    var timerHolder = document.querySelector('.timer');
    var timer = document.querySelector('.timer span');
    var timerBar = document.querySelector('.timer div');

    audioHolder.removeAttribute('controls');
    controller.style.visibility = 'visible';

    controller_play.addEventListener('click', function(){tempoWeb.control_play(controller_play);});
    controller_stop.addEventListener('click', function(){tempoWeb.control_stop(controller_play);});
    controller_next.addEventListener('click', function() {tempoWeb.control_next();});
    controller_back.addEventListener('click', function() {tempoWeb.control_back();});
    audioPlayer.addEventListener('timeupdate', function(){
        tempoWeb.updatePlayerTime(timerHolder, timerBar, timer);
      });

    var barLoc = timerHolder.getBoundingClientRect();
    document.onclick = function(e) {
      if(e.x >= barLoc.left && e.x <= barLoc.right && e.y >= barLoc.top 
        && e.y <= barLoc.bottom && !audioPlayer.paused) {
          var width = barLoc.right - barLoc.left;
          var clickedPos = e.x - barLoc.left;
          var percent = (clickedPos / width)
          var totalTime = audioPlayer.duration
          var setTime = totalTime * percent;
          audioPlayer.currentTime = setTime;
          audioPlayer.play();
        }
    }
    //End Player
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css">@import url("../assets/tempoWeb.css");</style>
