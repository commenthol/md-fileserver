# TODO

* features
  * [x] automatically start server with mdopen
  * [x] only show markdown files in Index
  * [x] auto update on file changes (using websockets)
  * [x] autoupdate port in `reload.js`
  * [x] change markdown parser from `marked` to `markdown-it`
  * [ ] write pid file of server
  * [ ] allow stoping the server with `mdstart --stop`
  * [ ] nicer css template(s)
  * [ ] enable config changes via server

* fixes
  * [x] allow websocket connections from multiple browsers
  * [x] disconnect websocket connections if closed
  * [x] autoreconnect browser websocket connection
  * [x] watchFile not working on OSX
  * [x] fix problems with URI encoding
