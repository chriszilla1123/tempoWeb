webpackJsonp([1],{"+a4w":function(t,e){},0:function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("7+uW"),i={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var r=a("VU/8")({name:"app",methods:{}},i,!1,function(t){a("+a4w")},null,null).exports,s=a("/ocq"),o=new Audio,l="http://www.chilltec.net:8000",c=[],d=-1,u=-1,v=[],g=[],m=[],p=[],b={name:"tempoWeb",methods:{playSong(t){o.pause(),o.src=t,o.load(),o.play()},playSongById(t){var e=c.indexOf(parseInt(t));u=c.length>=e+1?c[e+1]:-1,console.log("Next song: "+u),o.pause(),o.src=l+"/getSongById/"+t,o.load(),o.play(),console.log("Playing: "+t),d=parseInt(t)},playRandomSongByArtist(t){src=l+"/getRandomSongByArtist/"+t},control_play(t){o.paused?(t.setAttribute("data-icon","u"),o.play()):(t.setAttribute("data-icon","P"),o.pause())},control_stop(t){t.setAttribute("data-icon","P"),o.pause(),o.currentTime=0},control_next(){var t=u;console.log("Playing: "+t);var e=c.indexOf(parseInt(t));-1!==t?(u=c.length>=e+1?c[e+1]:-1,console.log("Next up: "+u),this.playSong(l+"/getSongById/"+t),d=parseInt(t)):console.log("Hit end of queue")},control_back(){if(o.currentTime>=3)return o.pause(),o.currentTime=0,void o.play();var t=c.indexOf(parseInt(d));if(t-1>=0&&t-1<=c.length){u=d;var e=c[t-1];this.playSong(l+"/getSongById/"+e),d=parseInt(e),console.log("Playing: "+e),console.log("Up next: "+u)}},updatePlayerTime(t,e,a){var n,i,r=Math.floor(o.currentTime/60),s=Math.floor(o.currentTime-60*r);n=(r<10?"0"+r:r)+":"+(s<10?"0"+s:s),a.textContent=n,i=t.clientWidth*(o.currentTime/o.duration),e.style.width=i+"px"},getDBTables(t){this.$http.get(l+"/getArtists").then(e=>{g=e.body,this.$http.get(l+"/getAlbums").then(e=>{m=e.body,this.$http.get(l+"/getSongs").then(e=>{p=e.body,t()},t=>{console.log("Error: "+t.body)})},t=>{console.log("Error: "+t.body)})},t=>{console.log("Error: "+t.body)})},writeArtists(t){if(p!==[]){document.getElementById("typeLable").innerHTML="Artists";for(var e=g.length,a='<div class="container"><div class="row" id="artistHeader"><div class="col artistLink">Artist</div></div><div class="row"><div class="col-sm artistLink" tag="ArID_0">All Artists</div></div><div class="row"><div class="col-sm artistLink" tag="ArID_-1">All Songs</div></div>',n=0;n<e;n++)a+='<div class="row"><div class="col-sm artistLink" tag=ArID_'+g[n].id+">"+g[n].artist.toString()+"</div></div>";a+="</div>",document.getElementById("main").innerHTML=a,t()}else console.log("Error: Calling writeArtists() before getSongs()")},writeArtistPage(t,e,a=8){for(var n=[],i=0;i<m.length;i++)m[i].artist==t&&n.push(m[i]);document.getElementById("typeLable").innerHTML=g[t-1].artist;var r='<div class="container">';r+='<div class="row"><div class="col-sm albumLink" tag="AlID_0">All Songs</div>';for(i=0;i<n.length;i++)(i+1)%a==0&&0!==i&&(r+="</div>"),(i+1)%a==0&&0!==i&&(r+='<div class="row">'),r+='<div class="col-sm albumLink" tag=AlID_'+n[i].id+">"+n[i].album.toString()+"</div>";r+="</div>",document.getElementById("main").innerHTML=r,e()},writeAlbumPage(t,e,a){var n=[];if(0===t&&0===e)for(var i=0;i<p.length;i++)n.push(p[i]),v.push(p[i].id);else if(0===t){for(i=0;i<p.length;i++)p[i].artist===e&&(n.push(p[i]),v.push(p[i].id));document.getElementById("typeLable").innerHTML=g[e-1].artist}else{for(i=0;i<p.length;i++)p[i].album==t&&(n.push(p[i]),v.push(p[i].id));document.getElementById("typeLable").innerHTML=m[t-1].album}var r='<div class="container"><div class="row" id="songHeader"><div class="col-1"></div><div class="col">Title</div><div class="col">Artist</div><div class="col">Album</div></div>';for(i=0;i<n.length;i++){var s=(i+1).toString(),o=n[i].title.toString(),l=n[i].artist,c=n[i].album,d=g[l-1].artist,u=m[c-1].album;r+='<div class="row songLink align-middle" tag="SoID_'+n[i].id+'"><div class="col-1">'+s+'</div><div class="col">'+o+'</div><div class="col">'+d+'</div><div class="col">'+u+"</div></div>"}r+="</div>",document.getElementById("main").innerHTML=r,a()},playRandom(){var t=l+"/getRandomSong?time="+Date.now();this.playSong(t)},createArtistListeners(){for(var t=this,e=document.getElementsByClassName("artistLink"),a=0;a<e.length;a++){e[a].addEventListener("click",function(){var e=this.attributes.tag.nodeValue.split("ArID_")[1];"-1"===e?(document.getElementById("typeLable").innerHTML="All Songs",t.writeAlbumPage(0,0,t.createSongListeners)):t.writeArtistPage(e,t.createAlbumListeners)})}},createAlbumListeners(){var t=this,e=document.getElementsByClassName("albumLink"),a=e[e.length-1].attributes.tag.nodeValue.split("AlID_")[1];this.$http.get(l+"/getArtistByAlbum/"+a).then(a=>{for(var n=parseInt(a.body),i=0;i<e.length;i++){e[i].addEventListener("click",function(){var e=parseInt(this.attributes.tag.nodeValue.split("AlID_")[1]);t.writeAlbumPage(e,n,t.createSongListeners)})}},t=>{console.log("Error: "+t.body)})},createSongListeners(){for(var t=this,e=document.getElementsByClassName("songLink"),a=0;a<e.length;a++){e[a].addEventListener("click",function(){console.log("Got here"),c=v.slice();var e=this.attributes.tag.nodeValue.split("SoID_")[1];t.playSongById(e)})}}},mounted:function(){var t=this;t.getDBTables(function(){t.writeArtists(t.createArtistListeners)}),document.getElementById("home").onclick=function(){t.writeArtists(t.createArtistListeners)},o.addEventListener("ended",function(){t.control_next()});var e=document.querySelector("audio"),a=document.querySelector(".controls"),n=document.querySelector(".play"),i=document.querySelector(".stop"),r=document.querySelector(".next"),s=document.querySelector(".back"),l=document.querySelector(".timer"),c=document.querySelector(".timer span"),d=document.querySelector(".timer div");e.removeAttribute("controls"),a.style.visibility="visible",n.addEventListener("click",function(){t.control_play(n)}),i.addEventListener("click",function(){t.control_stop(n)}),r.addEventListener("click",function(){t.control_next()}),s.addEventListener("click",function(){t.control_back()}),o.addEventListener("timeupdate",function(){t.updatePlayerTime(l,d,c)});var u=l.getBoundingClientRect();document.onclick=function(t){if(t.x>=u.left&&t.x<=u.right&&t.y>=u.top&&t.y<=u.bottom&&!o.paused){var e=u.right-u.left,a=(t.x-u.left)/e,n=o.duration*a;o.currentTime=n,o.play()}}}},y={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"main-page"}},[a("nav",{staticClass:"navbar navbar-expand-md navbar-dark fixed-top bg-dark"},[a("div",{staticClass:"navbar-brand",attrs:{id:"home"}},[t._v("Tempo Web")]),t._v(" "),a("button",{staticClass:"navbar-toggler",attrs:{type:"button","data-toggle":"collapse","data-target":"#navbarCollapse","aria-controls":"navbarCollapse","aria-expanded":"false","aria-label":"Toggle navigation"}},[a("span",{staticClass:"navbar-toggler-icon"})]),t._v(" "),a("div",{staticClass:"collapse navbar-collapse",attrs:{id:"navbarCollapse"}},[a("ul",{staticClass:"navbar-nav mr-auto"},[a("div",{attrs:{id:"playerHolder"}},[a("audio",{attrs:{controls:""}}),t._v(" "),a("div",{staticClass:"controls"},[a("button",{staticClass:"back control-button",attrs:{"data-icon":"B","aria-label":"rewind"}}),t._v(" "),a("button",{staticClass:"play control-button",attrs:{"data-icon":"P","aria-label":"play pause toggle"}}),t._v(" "),a("button",{staticClass:"stop control-button",attrs:{"data-icon":"S","aria-label":"stop"}}),t._v(" "),a("button",{staticClass:"next control-button",attrs:{"data-icon":"F","aria-label":"fast forward"}}),t._v(" "),a("div",{staticClass:"timer"},[a("div"),t._v(" "),a("span",{attrs:{"aria-label":"timer"}},[t._v("00:00")])])])])])])]),t._v(" "),a("h1",{attrs:{id:"typeLable"}},[t._v("Artists")]),t._v(" "),a("div",{attrs:{id:"mainView.vue"}})])}]};var h=a("VU/8")(b,y,!1,function(t){a("nFje")},null,null).exports,f={name:"about",data:()=>({})},_={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"main-page"},[e("h1",[this._v(" Goodybe World! ")])])}]};a("VU/8")(f,_,!1,function(t){a("dtkC")},"data-v-01146175",null).exports;n.a.use(s.a);var A=new s.a({routes:[{path:"/",name:"tempoWeb",component:h}]}),L=a("8+8L");n.a.config.productionTip=!1,n.a.use(L.a),new n.a({el:"#app",router:A,components:{App:r},template:"<App/>"})},dtkC:function(t,e){},nFje:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.070eb36f5f8f1d881cf6.js.map