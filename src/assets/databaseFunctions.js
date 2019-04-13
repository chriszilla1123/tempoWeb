//Database Functions
const functions = {
  test(message){
    alert(message);
  },

  getAlbumIDsByArtistID(artistID, artistsDB, albumsDB){
    //Accepts an artist ID and returns an array of corresponding album IDs.
      let result = [];
      artistID = parseInt(artistID);
      albumsDB.forEach(function(album){
        if(album.artist === artistID){
          result.push(album.id);
        }
      });
      return result;
  },

  getSongIDsByAlbumID(albumID, albumsDB, songsDB){
    let result = [];
    albumID = parseInt(albumID);
    songsDB.forEach(function(song){
      if(song.album === albumID){
        result.push(song.id);
      }
    });
    return result;
  }
};
export default functions
