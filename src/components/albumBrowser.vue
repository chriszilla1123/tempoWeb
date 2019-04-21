<template src="../assets/albumBrowser.html"></template>

<script>
  export default {
    name: "albumBrowser",
    props: {
      tempo: Object, //Reference to the main Tempo component
      albumList: Array,
      typeLabel: String, //For the label on the top of the screen, in the form of "Artist"
      artistsDB: Array,
      albumsDB: Array,
      songsDB: Array,
    },
    methods: {
      writeAlbums(albums, albumsDB, artistsDB, tempo){
        //Writes links and listeners for albums in the given set
        let baseURL = "https://www.chrisco.top/api";
        let gridWidth = 3;
        let html = '<div class="container">';

        for(let i=0; i < albums.length; i++){
          let albumID = albums[i];
          let index = albumID - 1;
          let albumName = albumsDB[index].album;
          let artistID = albumsDB[index].artist;
          let artistName = artistsDB[artistID - 1].artist;
          let numSongs = albumsDB[index].numSongs.toString();
          let artUrl = baseURL + "/getAlbumArtById/" + albumID.toString();

          if(i % gridWidth === 0){
            html += '<div class="row">';
          }
          html += '<div class="col albumHolder">'
              + '<div class="container albumLink" tag="AlID_' + albumID + '">'
              + '<div class="row d-flex justify-content-center" tag="AlId_' + albumID + '"</div>'
              + '<img class="row albumArt" alt="albumArtwork" src="' + artUrl + '" tag="AlID_' + albumID + '">'
              + '</div>'
              + '<div class="row albumLabel albumLink d-flex justify-content-center" tag="AlID_' + albumID + '">' + albumName + '</div>'
              + '</div></div>';
          if(i === albums.length - 1){
            for(let n = i % gridWidth; n < gridWidth - 1; n++){
              html += '<div class="col"></div>'
            }
          }
          if(i % gridWidth === gridWidth - 1){
            html += '</div>';
          }

        }
        html += '</div>';
        document.getElementById("albumBrowserContent").innerHTML = html;
        this.addAlbumListeners(tempo);
      },
      addAlbumListeners(tempo){
        //Show songs when an album is clicked
        let albumLinks = document.getElementsByClassName("albumLink");
        let playAllLinks = document.getElementsByClassName("allSongsByAlbum");
        for(let i=0; i < albumLinks.length; i++){
          let albumLink = albumLinks[i];
          albumLink.addEventListener('click', function(){
            let albumID = this.attributes.tag.nodeValue.split('AlID_')[1];
            let songList = tempo.getSongIDsByAlbumID(albumID);
            console.log("Getting all songs in album: " + albumID);
            console.log(songList);
            tempo.openSongBrowser({songList: songList});
          })
        }
      },
    },
    mounted: function() {
      let tempo = this.tempo;
      let albumBrowser = this;
      let albumList = this.albumList;
      let typeLabel = this.typeLabel;
      let artistsDB = this.artistsDB;
      let albumsDB = this.albumsDB;
      let songsDB = this.songsDB;
      //Write the given albums to the screen
      albumBrowser.writeAlbums(albumList, albumsDB, artistsDB, tempo);

      //Update the top label with typeLabel, if it was provided
      if(typeLabel !== undefined){
        document.getElementById('typeLabel').innerHTML = typeLabel.toString();
      }
    }
  }
</script>

<style scoped>

</style>