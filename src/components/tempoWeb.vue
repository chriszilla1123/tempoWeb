<template>
  <div id="main-page">
      <h1 id="typeLable">Artists</h1>
      <div id="artistGrid"></div>
  </div>
</template>

<script>
var audioPlayer = new Audio();
var baseURL = "http://www.chilltec.net:8000"
var songs = [];
var artists = []
export default {
  name: 'tempoWeb',
  data () {
    return {
      artists: []
    }
  },
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
    control_play(){
      audioPlayer.play();
    },
    control_pause(){
      audioPlayer.pause();
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
        console.log(artists);
        cb();
      }, response => { console.log("ERROR: " + response.body); });
    },
    writeArtists(){
      if(songs === []){
        console.log("Error: Calling writeArtists() before getSongs()");
        return;
      }
      document.getElementById("typeLable").innerHTML = "Artists";
      var numArtists = artists.length;
      console.log("Num artists: " + numArtists);
      var html = ""
      for(var i = 0; i < numArtists; i++){
        var randomLink = baseURL + "/getRandomSongByArtist/" + artists[i].id.toString();
        if(i % 12 == 0){
          html += '<div class="row">';
        }
        html += '<div class="col-xl-1">' +
          '<a onClick="playRandomSongByArtist(' +
          artists[i].artist.toString() + ')">' +
          artists[i].artist.toString() + '</a></div>';
      }
      document.getElementById("artistGrid").innerHTML = html;
      console.log(html);
    }
  },
  created: function() {
    var tempoWeb = this;
    tempoWeb.getSongs(function (){
      tempoWeb.getArtists(function (){
        tempoWeb.writeArtists();
      })
    })
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
