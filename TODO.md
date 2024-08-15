# TODO

- features

  - [x] automatically start server with mdopen
  - [x] only show markdown files in Index
  - [x] auto update on file changes (using websockets)
  - [x] autoupdate port in `reload.js`
  - [x] change markdown parser from `marked` to `markdown-it`
  - [x] nicer css template(s) for highlight
  - [x] enable config changes via server
  - [ ] write pid file of server
  - [ ] allow stoping the server with `mdstart --stop`

- fixes
  - [x] allow websocket connections from multiple browsers
  - [x] disconnect websocket connections if closed
  - [x] autoreconnect browser websocket connection
  - [x] watchFile not working on OSX
  - [x] fix problems with URI encoding
  - [x] secure server with session
