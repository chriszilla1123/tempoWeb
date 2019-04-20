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
        let html = '<div class="container">';
        html += '<div class="row" id="albumHeader"><div class="col-1"></div>'
            + '<div class="col">Album</div><div class="col">Artist</div>'
            + '<div class="col-1">Songs</div>'
            + '<div class="col-1">Controls</div></div>';
        for(let i=0; i < albums.length; i++){
          let albumID = albums[i];
          let index = albumID - 1;
          let albumName = albumsDB[index].album;
          let artistID = albumsDB[index].artist;
          let artistName = artistsDB[artistID - 1].artist;
          let numSongs = albumsDB[index].numSongs.toString();


          html += '<div class="row albumLink" tag="AlID_' + albumID + '">'
              + '<div class="col-1">' + (i+1).toString() + '</div>'
              + '<div class="col">' + albumName + '</div>'
              + '<div class="col">' + artistName + '</div>'
              + '<div class="col-1">' + numSongs + '</div>'
              + '<i class="AllSongsByArtist fas fa-play col-1"></i></div>';
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
            tempo.openSongBrowser(songList);
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