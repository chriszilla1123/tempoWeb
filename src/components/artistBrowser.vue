<template src="../assets/artistBrowser.html"></template>

<script>
  //Expected params: artistList: Array of ints

  export default {
    name: "artistBrowser",
    props: {
      tempo: Object, //Reference to the main Tempo component
      artistList: Array,
      artistsDB: Array,
      albumsDB: Array,
      songsDB: Array,
    },
    methods: {
      writeArtists(artists, artistsDB, tempo) {
        /*Writes links and listeners for artists in the given set*/
        let gridWidth = 2;
        let html = '<div class="container">';
        html += '<div class="container" id="artistGrid">';
        for (let i = 0; i < artists.length; i++) {
          let artistID = artists[i];
          let index = artistID - 1;
          let onArtist = artistsDB[index].artist.toString();

          if(i % gridWidth === 0){
            html += '<div class="row">';
          }
          html += '<div class="col row artistLinkContainer" tag="ArID_' + artistID + '">'
              + '<div class="col artistLink" tag="ArID_' + artistID + '">' + onArtist + '</div></div>';
          if(i % gridWidth === gridWidth - 1 || i === artists.length - 1){
            html += '</div>';
            html += '<div class="row artistBreak"></div>';
          }
        }
        html += '</div>';
        document.getElementById("artistBrowserContent").innerHTML = html;
        this.addArtistListeners(tempo, artistsDB);
      },
      addArtistListeners(tempo, artistsDB){
        //Show albums when an artist is clicked
        let artistLinks = document.getElementsByClassName("artistLink");
        let playAllLinks = document.getElementsByClassName("allSongsByArtist");
        let editLinks = document.getElementsByClassName("editArtist");
        for(let i=0; i < artistLinks.length; i++){
          let artistLink = artistLinks[i];
          artistLink.addEventListener('click', function() {
            let artistID = this.attributes.tag.nodeValue.split('ArID_')[1];
            let albumList = tempo.getAlbumIDsByArtistID(artistID);
            let artistName = artistsDB[artistID - 1].artist;
            tempo.openAlbumBrowser({albumList: albumList, label: artistName});
          });
        }
        for(let i=0; i < playAllLinks.length; i++){
          let tempoWeb = this; //Store reference to 'this' across callbacks.
          let playAllLink = playAllLinks[i];
          playAllLink.addEventListener('click', function() {
            songSet = []; //Clear song set
            for(let j=0; j < songsDB.length; j++){
              let onArtistID = parseInt(this.parentElement.attributes.tag.nodeValue.split('ArID_')[1]);
              if(songsDB[j].artist === onArtistID){
                songSet.push(songsDB[j].id);
              }
            }
            let toPlay = songSet[0];
            tempoWeb.playSongById(toPlay);
          });
        }
      },
    },
    mounted: function () {
      let tempo = this.tempo;
      let artistBrowser = this;
      let artistList = this.artistList;
      let artistsDB = this.artistsDB;
      let albumsDB = this.albumsDB;
      let songsDB = this.songsDB;
      artistBrowser.writeArtists(artistList, artistsDB, tempo);
    }
  }
</script>

<style scoped>

</style>