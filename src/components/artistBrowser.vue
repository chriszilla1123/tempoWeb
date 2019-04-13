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
        let html = '<div class="container">';
        html += '<div class="row" id="artistHeader"><div class="col-1"></div>'
            + '<div class="col artistHeader">Artist</div><div class="col-1">Albums</div>'
            + '<div class="col-1">Songs</div>'
            + '<div class="col-1">Controls</div></div>';
        for (let i = 0; i < artists.length; i++) {
          let artistID = artists[i];
          let index = artistID - 1;
          let onArtist = artistsDB[index].artist.toString();
          let numAlbums = artistsDB[index].numAlbums.toString();
          let numSongs = artistsDB[index].numSongs.toString();
          html += '<div class="row artistLinkContainer" tag="ArID_' + artistID + '">'
              + '<div class="col-1 artistLink" tag="ArID_' + artistID + '">' + (i + 1).toString() + '</div>'
              + '<div class="col artistLink" tag="ArID_' + artistID + '">' + onArtist + '</div>'
              + '<div class="col-1 artistLink" tag="ArID_' + artistID + '">' + numAlbums + '</div>'
              + '<div class="col-1 artistLink" tag="ArID_' + artistID + '">' + numSongs + '</div>'
              + '<div class="col-1 artistAlbumControls" tag="ArID_' + artistID + '" title="Play All">'
              + '<i class="allSongsByArtist fas fa-play"></i> <i class="editArtist fas fa-cog"></i></div></div>';
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
      window.history.replaceState([], "/", "/"); //updates URL
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