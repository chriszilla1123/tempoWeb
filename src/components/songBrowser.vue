<template src="../assets/songBrowser.html"></template>

<script>
  export default {
    name: "songBrowser",
    props: {
      tempo: Object, //Reference to the main Tempo component
      songList: Array,
      typeLabel: String, //For the label at the top screen, in the form "Album - Artist" or "Playlist"
      artistsDB: Array,
      albumsDB: Array,
      songsDB: Array,
    },
    methods: {
      writeSongs(songs, songsDB, albumsDB, artistsDB, tempo) {
        //Writes links and listeners for songs in the given set

        //Write the header HTML
        let html = '<div class="container">';

        for (let i = 0; i < songs.length; i++) {
          let songID = songs[i];
          let index = songID - 1;
          let songTitle = songsDB[index].title;
          let albumID = songsDB[index].album;
          let artistID = songsDB[index].artist;
          let albumName = albumsDB[albumID - 1].album;
          let artistName = artistsDB[artistID - 1].artist;

          //Write the HTML for each song
          html += '<div class="row songLink align-middle" tag="SoID_' + songID + '">'
              + '<div class="col-6">' + songTitle + '</div>'
              + '<div class="col songSubInfo">' + artistName + '</div>'
              + '<div class="col songSubInfo">' + albumName + '</div>'
              + '</div>';
          html += '<div class="songbreak"></div>'
        }
        html += '</div>';
        //Set the content body to the generated HTML
        document.getElementById("songBrowserContent").innerHTML = html;
        //Set listeners to listen for click events
        this.addSongListeners(songs, tempo);
      },
      addSongListeners(songList, tempo) {
        //Adds the currently shown songs to the SongSet, and plays the clicked song
        let songLinks = document.getElementsByClassName("songLink");
        for (let i = 0; i < songLinks.length; i++) {
          let songLink = songLinks[i];
          songLink.addEventListener('click', function () {
            let songID = this.attributes.tag.nodeValue.split('SoID_')[1];
            //Update the SongSet BEFORE playing the song
            tempo.setSongSet(songList);
            tempo.playSongById(songID);
          })
        }
      }
    },
    mounted: function () {
      let tempo = this.tempo;
      let songBrowser = this;
      let songList = this.songList;
      let artistsDB = this.artistsDB;
      let albumsDB = this.albumsDB;
      let songsDB = this.songsDB;
      let typeLabel = this.typeLabel;

      //Write songs to the screen
      songBrowser.writeSongs(songList, songsDB, albumsDB, artistsDB, tempo);

      //Add songs to the browsing set.
      tempo.setBrowsingSongSet(songList);

      //Update the top label with typeLabel, if it was provided
      if (typeLabel !== undefined) {
        document.getElementById('typeLabel').innerHTML = typeLabel.toString();
      }
    }
  }
</script>

<style scoped>

</style>