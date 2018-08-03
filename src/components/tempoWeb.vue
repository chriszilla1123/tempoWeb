<template>
  <div id="main-page">
      <h1 id="typeLable">Artists</h1>
      <div id="artistGrid"></div>
  </div>
</template>

<script>
var audioPlayer = new Audio();
var library = [];
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
    control_play(){
      audioPlayer.play();
    },
    control_pause(){
      audioPlayer.pause();
    },
    getLibrary(cb){
      this.$http.get("http://www.chilltec.net:8000/getLibrary").then(response => {
        library = response.body;
        cb();
      }, response => { console.log("ERROR: " + response.body); });
    },
    getArtists(cb){
      this.$http.get("http://www.chilltec.net:8000/getArtists").then(response => {
        artists = response.body;
        console.log(artists);
        cb();
      }, response => { console.log("ERROR: " + response.body); });
    },
    writeArtists(){
      if(library === []){
        console.log("Error: Calling writeArtists() before getLibrary()");
        return;
      }
      document.getElementById("typeLable").innerHTML = "Artists";
      var numArtists = artists.length;
      console.log("Num artists: " + numArtists);
      var html = ""
      for(var i = 0; i < numArtists; i++){
        if(i % 12 == 0){
          html += '<div class="row">';
        }
        html += '<div class="col-xl-1">' +
          artists[i].artist.toString() + '</div>';
      }
      document.getElementById("artistGrid").innerHTML = html;
      console.log(html);
    }
  },
  created: function() {
    var tempoWeb = this;
    tempoWeb.getLibrary(function (){
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
