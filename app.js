var express = require('express');
var http = require('http');
var path = require('path');
require('./api/models/db');

var app = express();

// all environments
app.set("port",process.env.PORT || 3000);
app.set("views",path.join(__dirname,"server","views"));
app.set("view engine",'jade');
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser("your secret here"));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname,"public")));

// development only
if(app.get("env") == "development") {
  app.use(express.errorHandler());
}

require("./routes")(app);
require("./api/routes")(app);

http.createServer(app).listen(app.get("port"),function() {
  console.log("Express server listening on port " + app.get("port"));
});
