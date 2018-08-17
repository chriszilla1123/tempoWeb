<template src="../assets/tempoWeb.html"></template>

<script>
//import 'player.js';
//player myplayer;

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
      //Takes a full src path to an audio resource and plays it.
      //Should only be used by playSongByID function.
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
      this.writeCurrentPlayingInfo(songID);
    },
    writeCurrentPlayingInfo(songID){
      var albumID = -1;
      var artistID = -1;
      var song = ""
      var album = "";
      var artist = "";

      if(songsDB.length === 0) return;
      if(songID < 1 || songID > songsDB.length) return;
      for(var i=0; i < songsDB.length; i++){
        if(songsDB[i].id == songID) {
          albumID = songsDB[i].album;
          artistID = songsDB[i].artist;
          break;
        }
      }
      for(var i=0; i < songsDB.length; i++){
        if(songsDB[i].id == songID){
          song = songsDB[i].title;
          break;
        }
      }
      if(albumID === -1 || artistID === -1) return;
      for(var i=0; i < albumsDB.length; i++){
        if(albumsDB[i].id == albumID){
          album = albumsDB[i].album;
          break;
        }
      }
      for(var i=0; i < artistsDB.length; i++){
        if(artistsDB[i].id == artistID){
          artist = artistsDB[i].artist;
          break;
        }
      }
      if(song === "" ||album === "" || artist === "") return;
      document.getElementById('cur-song').innerHTML = song;
      document.getElementById('cur-album').innerHTML = album;
      document.getElementById('cur-artist').innerHTML = artist;
    },
    writeArtists(){
      /*Writes information for all artists on the main page. 'Width' denotes
      the maximum number of artists to display in one row on larger screens.*/
      if(songsDB === []){
        console.log("Error: Calling writeArtists() before getSongs()");
        return;
      }
      document.getElementById("typeLable").innerHTML = "Artists";
      var numArtists = artistsDB.length;

      //Artist Links
      var html = '<div class="container">';
      html += '<div class="row artistLink allAlbums" tag="ArID_0"><div class="col">'
        + 'All Albums</div></div>'
        + '<div class="row artistLink allSongs" tag="ArID_-1"><div class="col">All Songs</div>'
        + '</div>';
      html += '<div class="row" id="artistHeader"><div class="col-1"></div>'
        + '<div class="col artistHeader">Artist</div><div class="col-1">Albums</div>'
        + '<div class="col-1">Songs</div>'
        + '<div class="col-1">Controls</div></div>'
      for(var i = 0; i < numArtists; i++){
        var onArtistID = artistsDB[i].id.toString();
        var onArtist = artistsDB[i].artist.toString();
        var numAlbums = artistsDB[i].numAlbums.toString();
        var numSongs = artistsDB[i].numSongs.toString();
        html += '<div class="row artistLinkContainer" tag="ArID_' + onArtistID + '">'
          + '<div class="col-1 artistLink" tag="ArID_' + onArtistID + '">' + (i+1).toString() + '</div>'
          + '<div class="col artistLink" tag="ArID_' + onArtistID + '">' + onArtist + '</div>'
          + '<div class="col-1 artistLink" tag="ArID_' + onArtistID + '">' + numAlbums + '</div>'
          + '<div class="col-1 artistLink" tag="ArID_' + onArtistID + '">' + numSongs + '</div>'
          + '<div class="col-1 allSongsByArtist" tag="ArID_' + onArtistID + '">PA</div></div>';
      }
      html += '</div>';
      document.getElementById("main").innerHTML = html;
      
      //listeners
      var tempoWeb = this; //Holds 'tempoWeb' location through the callback
      var artistLinks = document.getElementsByClassName("artistLink");
      var playAllLinks = document.getElementsByClassName("allSongsByArtist");
      for(var i=0; i < artistLinks.length; i++){
        var artistLink = artistLinks[i];
        artistLink.addEventListener('click', function() {
          var artistID = this.attributes.tag.nodeValue.split('ArID_')[1];
          if(artistID === '-1'){
            //All songs entire catelog
            document.getElementById("typeLable").innerHTML = "All Songs";
            tempoWeb.writeSongPage(0, 0);
          }
          else if(artistID === '0'){
            //All albums entire catelog
            document.getElementById("typeLable").innerHTML = "All Albums";
            tempoWeb.writeAlbumPage(0);
          }
          else{
            tempoWeb.writeAlbumPage(artistID);
          }
        });
      }
      for(var i=0; i < playAllLinks.length; i++){
        var playAllLink = playAllLinks[i];
        playAllLink.addEventListener('click', function() {
          songSet = [] //Clear song set
          for(var j=0; j < songsDB.length; j++){
            var onArtistID = parseInt(this.attributes.tag.nodeValue.split('ArID_')[1]);
            if(songsDB[j].artist === onArtistID){
              songSet.push(songsDB[j].id);
            }
          }
          var toPlay = songSet[0];
          tempoWeb.playSongById(toPlay);
        });
      }
      //end listeners
    },
    writeAlbumPage(artistID){
      /*Writes information about albums from one or more artists*/
      var albums = [];
      if(artistID === 0){
        //All albums from all artists
        for(var i=0; i < albumsDB.length; i++){
          albums.push(albumsDB[i]);
        }
      }
      else{
        //Albums from a particular artist
        for(var i=0; i < albumsDB.length; i++){
          if(albumsDB[i].artist == artistID){
            albums.push(albumsDB[i]);
          }
        }
        document.getElementById("typeLable").innerHTML = artistsDB[artistID - 1].artist;
      }
      var html = '<div class="container">'
      html += '<div class="row albumLink allSongs" tag="AlID_0"><div class="col" tag="AlID">'
      + 'All Songs</div></div>'; 
      html += '<div class="row" id="albumHeader"><div class="col-1"></div>'
        + '<div class="col">Album</div><div class="col">Artist</div>'
        + '<div class="col-1">Songs</div></div>';
        for(var i=0; i < albums.length; i++){
        var onSong = (i+1).toString();
        var onAlbum = albums[i].album.toString();
        var onArtistNumber = albums[i].artist;
        var onArtist = artistsDB[onArtistNumber-1].artist;
        var numSongs = albums[i].numSongs.toString();
        html += '<div class="row albumLink" tag="AlID_' + albums[i].id + '">'
          + '<div class="col-1">' + onSong + '</div>'
          + '<div class="col">' + onAlbum + '</div>'
          + '<div class="col">' + onArtist + '</div>'
          + '<div class="col-1">' + numSongs + '</div></div>';
      }
      html += '</div>';
      document.getElementById('main').innerHTML = html;
      //listeners TODO: Fix this for 'All Albumbs -> All Artists page
      var tempoWeb = this;
      var albumLinks = document.getElementsByClassName("albumLink");
      var lastAlbum = albumLinks[albumLinks.length - 1].attributes.tag.nodeValue.split('AlID_')[1];
      this.$http.get(baseURL + "/getArtistByAlbum/" + lastAlbum).then(response => {
        var artistID = parseInt(response.body);
        for(var i=0; i < albumLinks.length; i++){
          var albumLink = albumLinks[i]
          albumLink.addEventListener('click', function() {
            var albumID = parseInt(this.attributes.tag.nodeValue.split('AlID_')[1]);
            tempoWeb.writeSongPage(albumID, artistID);
          });
        }
      }, response => { console.log("Error: " + response.body);});
      //end listeners
    },
    writeSongPage(albumID, artistID) {
    //Writes all songs in album
      var songs = [];
      browsingSongSet = [] //Clear the browsing set
      if(albumID === 0 && artistID === 0) {
        for(var i=0; i < songsDB.length; i++){
          songs.push(songsDB[i]);
          browsingSongSet.push(songsDB[i].id);
        }
      }
      else if(albumID === 0) {
        //For "All Songs" from artist link
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
      //Song Links
      var html = '<div class="container">'
        + '<div class="row" id="songHeader">'
        + '<div class="col-1"></div><div class="col">Title</div><div class="col">Artist</div>'
        + '<div class="col">Album</div></div>';
      for(var i=0; i < songs.length; i++){
        var onSong = (i+1).toString();
        var songTitle = songs[i].title.toString();
        var onArtistID = songs[i].artist;
        var onAlbumID = songs[i].album;
        var artist = artistsDB[onArtistID-1].artist;
        var album = albumsDB[onAlbumID-1].album;
        var test = 1;
        html += '<div class="row songLink align-middle" tag="SoID_' + songs[i].id + '">' 
          + '<div class="col-1">' + onSong + '</div>'
          + '<div class="col">' + songTitle + '</div>'
          + '<div class="col">' + artist + '</div>'
          + '<div class="col">' + album + '</div>'
          + '</div>';
      }
      html += '</div>';
      //End Song Links
      document.getElementById('main').innerHTML = html;
      //listeners
      var tempoWeb = this;
      var songLinks = document.getElementsByClassName("songLink");
      for(var i=0; i < songLinks.length; i++) {
        var songLink = songLinks[i];
        songLink.addEventListener('click', function() {
          songSet = browsingSongSet.slice();
          var songId = this.attributes.tag.nodeValue.split('SoID_')[1];
          tempoWeb.playSongById(songId);
        });
      }
    },

    //Player functions
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
        this.playSongById(toPlay);
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
        this.playSongById(toPlay);
        curSong = parseInt(toPlay);
        console.log("Playing: " + toPlay);
        console.log("Up next: " + nextSong);
      }
    },
    updatePlayerTime(timeHolder, timeBar, timer, timeEnd){
      var min = Math.floor(audioPlayer.currentTime / 60); //Min/Sec set by user
      var sec = Math.floor(audioPlayer.currentTime - min * 60);
      var newMin     //To build the updated display
      var newSec;
      var newTime;    //To update the display
      var barLength;  //The time bar
      if(min < 10){ newMin = '0' + min; }
      else{ newMin = min;}
      if(sec < 10){ newSec = '0' + sec; }
      else{ newSec = sec; }
      newTime = newMin + ':' + newSec;
      timer.textContent = newTime;
      barLength = timeHolder.clientWidth * (audioPlayer.currentTime / audioPlayer.duration);
      timeBar.style.width = barLength + 'px';
      
      //End Time
      var endMin = Math.floor(audioPlayer.duration / 60);
      var endSec = Math.floor(audioPlayer.duration - endMin * 60);
      if(endMin < 10){ endMin = '0' + endMin }
      if(endSec < 10){ endSec = '0' + endSec }
      timeEnd.textContent = endMin.toString() + ':' + endSec.toString();
    },
    //End player functions

    //Helper functions
    getArtistByID(artistID){
      if(artistID < 1 || artistID > artistsDB.length) return null;
      for(var i=0; i < artistsDB.length; i++){
        if(artistsDB[i].id === artistID) return artistsDB[i].artist;
      }
      return null;
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
  },
  mounted: function() {
    //This is ran after the page is fully loaded.
    var tempoWeb = this;
    tempoWeb.getDBTables(function() {
      tempoWeb.writeArtists();
    });
    document.getElementById("home").onclick = function(){
      tempoWeb.writeArtists();
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
    var timer = document.querySelector('.timerText');
    var timeEnd = document.querySelector('.timeEnd');
    var timerBar = document.querySelector('.timer div');

    audioHolder.removeAttribute('controls');
    controller.style.visibility = 'visible';

    controller_play.addEventListener('click', function(){tempoWeb.control_play(controller_play);});
    controller_stop.addEventListener('click', function(){tempoWeb.control_stop(controller_play);});
    controller_next.addEventListener('click', function() {tempoWeb.control_next();});
    controller_back.addEventListener('click', function() {tempoWeb.control_back();});
    audioPlayer.addEventListener('timeupdate', function(){
        tempoWeb.updatePlayerTime(timerHolder, timerBar, timer, timeEnd);
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
