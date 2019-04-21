<template>
  <div id="search-browser">
    <h1 id="typeLabel">Search Results</h1>
    <div id="searchBrowserContent"></div>
    <artist-browser v-bind:tempo="tempo" v-bind:artistList="artistList" v-bind:artistsDB="artistsDB" v-bind:albumsDB="albumsDB" v-bind:songsDB="songsDB"></artist-browser>
    <album-browser v-bind:tempo="tempo" v-bind:albumList="albumList" v-bind:artistsDB="artistsDB" v-bind:albumsDB="albumsDB" v-bind:songsDB="songsDB"></album-browser>
    <song-browser v-bind:tempo="tempo" v-bind:songList="songList" v-bind:artistsDB="artistsDB" v-bind:albumsDB="albumsDB" v-bind:songsDB="songsDB"></song-browser>
  </div>
</template>

<script>
  import artistBrowser from '@/components/artistBrowser';
  import albumBrowser from '@/components/albumBrowser';
  import songBrowser from '@/components/songBrowser';
  export default {
    name: "searchBrowser",
    components: {
      'artist-browser': artistBrowser,
      'album-browser': albumBrowser,
      'song-browser': songBrowser,
    },
    props: {
      tempo: Object,
      artistList: Array,
      albumList: Array,
      songList: Array,
      artistsDB: Array,
      albumsDB: Array,
      songsDB: Array,
      searchTerm: String,
    },
    methods: {

    },
    mounted: function () {
      console.log("Got to searchBrowser");
      let tempo = this.tempo;
      let artistList = this.artistList;
      let albumList = this.albumList;
      let songList = this.songList;
      let artistsDB = this.artistsDB;
      let albumsDB = this.albumsDB;
      let songsDB = this.songsDB;
      let searchTerm = this.searchTerm;

      console.log(songList);
      console.log(albumList);
      console.log(artistList);
      console.log(songsDB);
      console.log(albumsDB);
      console.log(artistsDB);

      if (typeof (searchTerm) === 'string') {
        document.getElementById('typeLabel').innerHTML = "Search Results for '" + searchTerm.toString() + "'";
      }

      this.artistComponent = 'artistBrowser';

      //this.writeSearchResults(artistList, albumList, songList, artistsDB, albumsDB, songsDB, tempo);
    },
  }
</script>

<style scoped>

</style>