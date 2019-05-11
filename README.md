
# <img src="https://raw.githubusercontent.com/chriszilla1123/tempoWeb/master/src/assets/tempo_logo.png" alt="Logo" width="150"/> Tempo Web


[Try the live demo!](https://tempoweb.netlify.com/) |
[Hosted by Netlify.com](https://www.netlify.com/)


About
-------

A web client for the Tempo self-hosted music streaming software package, allowing you to stream your music and other media on any web-accessible device. It was written in HTML5, CSS3, and the [Vue.js](https://vuejs.org/) framework. 

Tempo Web uses Bootstrap and CSS3 media queries to provide a responsive experience suitable to desktop, tablet, and mobile browsing.

Requires Tempo Server for the hosting of your music and media. [TempoServer on GitHub](https://github.com/chriszilla1123/tempoServer)

Have an Android device? Try [Tempo Android](https://github.com/chriszilla1123/tempoAndroid) for offline access on the go. Coming soon to Google Play.


Installation
-------

Easy Install - 

Copy the contents of the `dist` directory into any web server. Be sure to include both the `index.html` file, and the entire `static/` directory.




Requirements
------------

* A web server. The following have been tested.
	* [Apache](https://www.apache.org/) **[Recommended]**
	* [NGINX](https://www.nginx.com/)
	* [Lighttpd](https://www.lighttpd.net/)
* [Tempo Server](https://github.com/chriszilla1123/tempoServer) - The companion server for media hosting.

Recommendations
--------------
These are not strictly required, but recommended for the best experience
* A domain name. This allows your site to be accessed from a memorable URL such as `www.example.com/tempo`. These can be purchased yearly from a domain name registrar such as [namesilo.com](http://www.namesilo.com) or [namecheap.com](https://www.namecheap.com/)
* A static IP, or a dynamic DNS. You can learn more about setting up a dynamic DNS here: [https://www.duckdns.org/why.jsp](https://www.duckdns.org/why.jsp)


Project by Christopher Hill



