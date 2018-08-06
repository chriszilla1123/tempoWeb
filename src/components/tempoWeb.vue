<template>
  <div id="main-page">
    <!-- Navber / Player -->
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="navbar-brand">Tempo Web</div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
          <button id="playRandom">Play Random</button>
          <div id="playerHolder">
            <audio controls></audio>
            <div class="controls">
              <button class="play control-button" data-icon="P" aria-label="play pause toggle"></button>
              <button class="stop control-button" data-icon="S" aria-label="stop"></button>
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
var baseURL = "http://www.chilltec.net:8000"
var songs = [];
var artists = []
export default {
  name: 'tempoWeb',
  methods: {
    playSong(src){
      audioPlayer.pause();
      audioPlayer.src = src;
      audioPlayer.load();
      audioPlayer.play();

    },
    PlayRandomSongByArtist(artist){
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
    getSongs(cb){
      this.$http.get(baseURL + "/getSongs").then(response => {
        songs = response.body;
        cb();
      }, response => { console.log("ERROR: " + response.body); });
    },
    getArtists(cb){
      this.$http.get(baseURL + "/getArtists").then(response => {
        artists = response.body;
        cb();
      }, response => { console.log("ERROR: " + response.body); });
    },
    writeArtists(width=4){
      /*Writes information for all artists on the main page. 'Width' denotes
      the maximum number of artists to display in one row on larger screens.*/

      if(songs === []){
        console.log("Error: Calling writeArtists() before getSongs()");
        return;
      }
      document.getElementById("typeLable").innerHTML = "Artists";
      var numArtists = artists.length;
      var html = '<div class="container">'
      for(var i = 0; i < numArtists; i++){
        var randomLink = baseURL + "/getRandomSongByArtist/" + artists[i].id.toString();
        if(i % width === 0 && i !== 0){
          html += '</div>';
        }
        if(i % width === 0){
          html += '<div class="row">';
        }
        html += '<div class="col-sm artistLink" tag=' +
        artists[i].id + '>' +
          artists[i].artist.toString() + '</div>';
      }
      html += '</div>';
      document.getElementById("main").innerHTML = html;
    },
    writeArtistPage(artistID){

    },
    playRandom(){
      var src = baseURL + "/getRandomSong?time=" + Date.now()
      this.playSong(src);
    },
  },
  mounted: function() {
    var tempoWeb = this;
    tempoWeb.getSongs(function (){
      tempoWeb.getArtists(function (){
        tempoWeb.writeArtists();
      })
    })
    document.getElementById("playRandom").onclick = function(){tempoWeb.playRandom();};

    var artistLinks = document.getElementsByClassName("artistLink"); //TODO
    for(var i=0; i < artistLinks.length; i++){
      var artistLink = artistLinks[i];
      artistLink.addEventListener('click', function() {
        console.log("Got here!");
      });
    }

    //Player
    var audioHolder = document.querySelector('audio');
    //audio player = new Audio();
    var controller = document.querySelector('.controls');
    var controller_play = document.querySelector('.play');
    var controller_stop = document.querySelector('.stop');
    //var controller_next = document.querySelector('.next'); TODO: Implement
    //var controller_back = document.querySelector('.back');
    var timerHolder = document.querySelector('.timer');
    var timer = document.querySelector('.timer span');
    var timerBar = document.querySelector('.timer div');

    audioHolder.removeAttribute('controls');
    controller.style.visibility = 'visible';

    controller_play.addEventListener('click', function (){tempoWeb.control_play(controller_play);});
    controller_stop.addEventListener('click', function (){tempoWeb.control_stop(controller_play);});
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
