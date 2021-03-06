<!--Adds the persistent navbar, audio player, and controls.
    This is the controller for TempoWeb, and handles downloading of the database
    and playback of audio. Other components should reference using the public methods -->

<!--Load the top navbar html-->
<template src="../assets/player.html"></template>

<script>
  //Set the base URL here. This will be the base URL for all API calls.
  //Example: http://example.com:8000 || https://example.com/api , etc
  //If your web server supports it, HTTPS is always preferred!
  //Default baseURL: https://www.chilltec.net/api

  let baseURL = "https://www.chilltec.net/api";

  // END CONFIGURATION VARIABLES //

  import dbf from "../assets/databaseFunctions";

  let audioPlayer = new Audio();
  let songSet = []; /*List of songs in the current playing set*/
  let curSong = -1; /*ID of the currently playing song*/
  let nextSong = -1; /*ID of next song to be played from the current playing set*/
  let prevSet = []; /*Stores the last played songs for the 'back' button*/
  let browsingSongSet = []; /*List of songs in the current browsing set*/

  let artistList = [];
  let albumList = [];
  let songList = [];

  /*Stores the 'artists' table from the database. Structure:
      [id], [artist], [numSongs], [numAlbums], [picture]*/
  let artistsDB = [];

  /*Stores the 'albums' table from the database. Structure:
    [id], [artist] [album], [numSongs], [albumArt]*/
  let albumsDB = [];

  /*Stores the 'songs' table from the database. Structure:
    [artist], [album], [title], [fileType], [directory], [id]*/
  let songsDB = [];


  export default {
    name: "tempo",
    data: function(){
      return {
        artistList, albumList, songList
      }
    },
    methods: {
      playSongById(songID) {
        //Used when clicking a song link
        let songSetIndex = songSet.indexOf(parseInt(songID));
        if (songSet.length >= (songSetIndex + 1)) {
          nextSong = songSet[songSetIndex + 1]; //songID, if it exists
        } else {
          nextSong = -1; //Otherwise, set to -1
        }
        audioPlayer.pause();
        audioPlayer.src = baseURL + "/getSongById/" + songID;
        audioPlayer.load();
        audioPlayer.play();
        curSong = parseInt(songID);
        this.writeCurrentPlayingInfo(songID);
      },
      setSongSet(set){
        /*Holds the list of songs currently playing. MUST be called every time a song is clicked by the user */
        /*MUST be called BEFORE the playSongById function when clicking a song*/
        songSet = set;
      },
      setBrowsingSongSet(set){
        /*Holds the list of songs in the last open SongBrowser. MUST be called every time the songBrowser is opened */
        browsingSongSet = set;
      },
      writeCurrentPlayingInfo(songID) {
        //Writes artist, album, and title information to the player
        songID = parseInt(songID);
        let albumID = -1;
        let artistID = -1;
        let song = "";
        let album = "";
        let artist = "";

        if (songsDB.length === 0) return;
        if (songID < 1 || songID > songsDB.length) return;
        for (let i = 0; i < songsDB.length; i++) {
          if (songsDB[i].id === songID) {
            albumID = songsDB[i].album;
            artistID = songsDB[i].artist;
            break;
          }
        }
        for (let i = 0; i < songsDB.length; i++) {
          if (songsDB[i].id === songID) {
            song = songsDB[i].title;
            break;
          }
        }
        if (albumID === -1 || artistID === -1) return;
        for (let i = 0; i < albumsDB.length; i++) {
          if (albumsDB[i].id === albumID) {
            album = albumsDB[i].album;
            break;
          }
        }
        for (let i = 0; i < artistsDB.length; i++) {
          if (artistsDB[i].id === artistID) {
            artist = artistsDB[i].artist;
            break;
          }
        }
        if (song === "" || album === "" || artist === "") return;
        document.getElementById('cur-song').innerHTML = song;
        document.getElementById('cur-album').innerHTML = album;
        document.getElementById('cur-artist').innerHTML = artist;
      },
      //Player functions
      control_play() {
        if (audioPlayer.paused) {
          audioPlayer.play();
        } else {
          audioPlayer.pause();
        }
      },
      control_stop() {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      },
      control_next() {
        let toPlay = nextSong;
        let songSetIndex = songSet.indexOf(parseInt(toPlay));
        if (toPlay !== -1) {
          if (songSet.length >= (songSetIndex + 1)) {
            nextSong = songSet[songSetIndex + 1]; //songID, if it exists
          } else {
            nextSong = -1; //Otherwise, set to -1
          }
          this.playSongById(toPlay);
          curSong = parseInt(toPlay);
        } else {
          console.log("Hit end of queue");
        }
      },
      control_back() {
        if (audioPlayer.currentTime >= 3) {
          audioPlayer.pause();
          audioPlayer.currentTime = 0;
          audioPlayer.play();
          return;
        }
        let songSetIndex = songSet.indexOf(parseInt(curSong));
        if (songSetIndex - 1 >= 0 && songSetIndex - 1 <= songSet.length) {
          nextSong = curSong;
          let toPlay = songSet[songSetIndex - 1];
          this.playSongById(toPlay);
          curSong = parseInt(toPlay);
        }
      },
      updatePlayPauseButton(){
        let play_button = document.querySelector('.play');
        if(audioPlayer.paused){
          play_button.setAttribute('data-icon', 'P');
        }
        else{
          play_button.setAttribute('data-icon', 'u');
        }
      },
      updatePlayerTime(timeHolder, timeBar, timer, timeEnd) {
        let min = Math.floor(audioPlayer.currentTime / 60); //Min/Sec set by user
        let sec = Math.floor(audioPlayer.currentTime - min * 60);
        let newMin;     //To build the updated display
        let newSec;
        let newTime;    //To update the display
        let barLength;  //The time bar
        if (min < 10) {
          newMin = '0' + min;
        } else {
          newMin = min;
        }
        if (sec < 10) {
          newSec = '0' + sec;
        } else {
          newSec = sec;
        }
        newTime = newMin + ':' + newSec;
        timer.textContent = newTime;
        barLength = timeHolder.clientWidth * (audioPlayer.currentTime / audioPlayer.duration);
        timeBar.style.width = barLength + 'px';

        //End Time
        let endMin = Math.floor(audioPlayer.duration / 60);
        let endSec = Math.floor(audioPlayer.duration - endMin * 60);
        if (endMin < 10) {
          endMin = '0' + endMin
        }
        if (endSec < 10) {
          endSec = '0' + endSec
        }
        if (isNaN(endMin)) endMin = '00';
        if (isNaN(endSec)) endSec = '00';
        timeEnd.textContent = endMin.toString() + ':' + endSec.toString();
      },
      //End player functions
      //Search
      searchAll(input){
        document.getElementById('typeLabel').innerHTML = "Search Results for " + input;
        let jsonRequest = {};
        jsonRequest['all'] = input;
        jsonRequest = JSON.stringify(jsonRequest);
        this.$http.post(baseURL + "/search", jsonRequest).then(response => {
          let artists = this.getIdsFromObjects(response.body[0][0]);
          let albums = this.getIdsFromObjects(response.body[1][0]);
          let songs = this.getIdsFromObjects(response.body[2][0]);
          this.openSearchBrowser({artistList: artists, albumList: albums, songList: songs, searchTerm: input});
        }, response => {  });
      },
      getIdsFromObjects(objects){
        //Search Helper, converts the Artist/Album/Song object arrays into integer ID arrays
        let list = [];
        if(Array.isArray(objects)){
          objects.forEach(function (element) {
            if(element.hasOwnProperty('id')){
              list.push(element.id);
            }
          });
        }
        return list;
      },
      //End Search
      //Helper functions
      getDBTables(cb) {
        /*Gets the contents of the 'artists', 'albums', and 'songs' tables
          from the database and stores them for local use.*/
        this.$http.get(baseURL + "/getArtists").then(response_ar => {
          artistsDB = response_ar.body;
          this.$http.get(baseURL + "/getAlbums").then(response_al => {
            albumsDB = response_al.body;
            this.$http.get(baseURL + "/getSongs").then(response_so => {
              songsDB = response_so.body;
              cb();
            }, response_so => {
              console.log("Error: " + response_so.body);
            });
          }, response_al => {
            console.log("Error: " + response_al.body);
          });
        }, response_ar => {
          console.log("Error: " + response_ar.body);
        });
      },
      arrayBuilder(start, end){
        //Builds an array of integers from start to end
        return Array.from(new Array(end - start), (x,i) => i + start);
      },
      //End Helper Functions

      //Routing functions
      openArtistBrowser(options){ //Supported options: {artistList: Array, showAll: Boolean}
        let artistList;
        if(options.hasOwnProperty('showAll') && options.showAll === true){
          artistList = this.arrayBuilder(1, artistsDB.length + 1);
        }
        else if(options.hasOwnProperty('artistList') && typeof(options.artistList) === typeof([])
          && options.artistList.length > 0){
          artistList = options.artistList;
        }
        else{
          artistList = this.arrayBuilder(1, artistsDB.length + 1);
        }
        this.$router.push({
          name: 'artistBrowser',
          params: {
            tempo: this,
            artistList: artistList,
            artistsDB: artistsDB,
            albumsDB: albumsDB,
            songsDB: songsDB,
          }
        });
        window.history.replaceState([], "/", "/"); //updates URL
      },
      openAlbumBrowser(options){ //Supported options: {albumList: Array, showAll: Boolean, label: String}
        let albumList;
        let typeLabel = undefined;
        if(options.hasOwnProperty('showAll') && options.showAll === true){
          albumList = this.arrayBuilder(1, albumsDB.length + 1);
        }
        else if (options.hasOwnProperty('albumList') && typeof(options.albumList) === typeof([])
          && options.albumList.length > 0){
          albumList = options.albumList;
        }
        else{
          albumList = this.arrayBuilder(1, albumsDB.length + 1);
        }

        if(options.hasOwnProperty('label') && typeof(options.label) === "string"){
          typeLabel = options.label;
        }

        this.$router.push({
          name: 'albumBrowser',
          params: {
            tempo: this,
            albumList: albumList,
            typeLabel: typeLabel,
            artistsDB: artistsDB,
            albumsDB: albumsDB,
            songsDB: songsDB,
          }
        });
        window.history.replaceState([], "/", "/"); //Updates URL
      },
      openSongBrowser(options){ //Supported options: {songList: Array, showAll: Boolean, label: String}
        let songList;
        let typeLabel = undefined;
        if(options.hasOwnProperty('showAll') && options.showAll === true){
          songList = this.arrayBuilder(1, songsDB.length + 1);
          typeLabel = "All Songs";
        }
        else if(options.hasOwnProperty('songList')){
          songList = options.songList; //Must be an array of integers.
        }
        else {
          songList = this.arrayBuilder(1, songsDB.length + 1);
          typeLabel = "All Songs";
        }

        if(options.hasOwnProperty('label')){
          typeLabel = options.label; //Must be a string
        }
        this.$router.push({
          name: 'songBrowser',
          params: {
            tempo: this,
            songList: songList,
            typeLabel: typeLabel,
            artistsDB: artistsDB,
            albumsDB: albumsDB,
            songsDB: songsDB,
          }
        });
        window.history.replaceState([], "/", "/"); //updates URL
      },
      openSearchBrowser(options){ //Required options: {artistList: Array, albumList: Array, songList: Array}
                                  //Supported options: {searchTerm: String}
        let artistList, albumList, songList;
        let searchTerm = undefined;

        if(options.hasOwnProperty('artistList')){
          artistList = options.artistList;
        }
        else { artistList = []; }

        if(options.hasOwnProperty('albumList')){
          albumList = options.albumList;
        }
        else{ artistList = []; }

        if(options.hasOwnProperty('songList')){
          songList = options.songList;
        }
        else { songList = []; }

        if(options.hasOwnProperty('searchTerm')){
          searchTerm = options.searchTerm;
        }

        this.$router.push({
          name: 'searchBrowser',
          params: {
            tempo: this,
            artistList: artistList,
            albumList: albumList,
            songList: songList,
            artistsDB: artistsDB,
            albumsDB: albumsDB,
            songsDB: songsDB,
            searchTerm: searchTerm,
          }
        });
        window.history.replaceState([], "/", "/"); //updates URL
      },
      //End routing functions

      //Connect DB functions, see databaseFunctions.js for implementation and comments.
      getAlbumIDsByArtistID(id) { return dbf.getAlbumIDsByArtistID(id, artistsDB, albumsDB) },
      getSongIDsByAlbumID(id) { return dbf.getSongIDsByAlbumID(id, albumsDB, songsDB) },
      //End connect DB functions
    },
    mounted: function () {
      //This function is ran after the page is loaded
      let tempo = this;
      tempo.getDBTables(function () {
        //Start the artistBrowser by default
        tempo.openArtistBrowser({showAll: true});
      });
      let homeLinks = document.getElementsByClassName('home');
      for(let i=0; i<homeLinks.length; i++){
        homeLinks[i].onclick = function(){
          tempo.openArtistBrowser({showAll: true})
        }
      }
      audioPlayer.addEventListener('ended', function () {
        tempo.control_next();
      });

      //Player
      let audioHolder = document.querySelector('audio');
      let controller = document.querySelector('.controls');
      let controller_play = document.querySelector('.play');
      let controller_stop = document.querySelector('.stop');
      let controller_next = document.querySelector('.next');
      let controller_back = document.querySelector('.back');
      let timerHolder = document.querySelector('.timer');
      let timer = document.querySelector('.timerText');
      let timeEnd = document.querySelector('.timeEnd');
      let timerBar = document.querySelector('.timer div');

      audioHolder.removeAttribute('controls');
      controller.style.visibility = 'visible';

      controller_play.addEventListener('click', function () {
        tempo.control_play();
      });
      controller_stop.addEventListener('click', function () {
        tempo.control_stop();
      });
      controller_next.addEventListener('click', function () {
        tempo.control_next();
      });
      controller_back.addEventListener('click', function () {
        tempo.control_back();
      });
      audioPlayer.addEventListener('timeupdate', function () {
        tempo.updatePlayerTime(timerHolder, timerBar, timer, timeEnd);
      });
      audioPlayer.addEventListener('play', function () {
        tempo.updatePlayPauseButton();
      });
      audioPlayer.addEventListener('pause', function () {
        tempo.updatePlayPauseButton();
      });

      let barLoc = timerHolder.getBoundingClientRect();
      document.onclick = function (e) {

        if (e.x >= barLoc.left && e.x <= barLoc.right && e.y >= barLoc.top
            && e.y <= barLoc.bottom && !audioPlayer.paused) {
          let width = barLoc.right - barLoc.left;
          let clickedPos = e.x - barLoc.left;
          let percent = (clickedPos / width);
          let totalTime = audioPlayer.duration;
          audioPlayer.currentTime = totalTime * percent;
          audioPlayer.play();
        }
      };
      //End Player

      //Nav Buttons
      let artistsButton = document.getElementById('artistsButton');
      let albumsButton = document.getElementById('albumsButton');
      let songsButton = document.getElementById('songsButton');

      artistsButton.addEventListener('click', function() {
        tempo.openArtistBrowser({showAll: true});
      });
      albumsButton.addEventListener('click', function() {
        tempo.openAlbumBrowser({showAll: true});
      });
      songsButton.addEventListener('click', function() {
        tempo.openSongBrowser({showAll: true});
      });
      //End Nav Buttons

      //Search bar
      let searchBar = document.querySelector('#searchBar');
      document.addEventListener('submit', function(e){
        e.preventDefault();
        let input = searchBar.value;
        tempo.searchAll(input);
      });
      searchBar.addEventListener('input', function(){
        let input = searchBar.value;
        //tempo.searchAll(input);
      });
      //End Search Bar
    }
  }
</script>

<style scoped type="text/css">@import url("../assets/tempoWeb.css");</style>