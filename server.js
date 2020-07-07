"use strict";
//set DEBUG environmental variable to sss:db, etc
var debug = require('debug')('SSS');
var cors = require('cors');
var config = require("config");
var morgan = require("morgan");
//import {router as entitiesRouter}  from './routes/entities';
var entitiesRouter = require('./routes/entities');
var express = require("express");
var helmet = require("helmet");
var logger = require("./middleware/logger");
var app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use('/api/entities', entitiesRouter);
if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Morgan: logging enabled");
}
//alternative location for deployment of Agnular dist files
app.use(express.static("./public"));
app.use(logger);
debug('mail.password: ' + config.get('mail.password'));
var appName = config.get("name");
var msg = appName + " is up and running";
app.get("/", function (req, res) {
    if (app.get("env") === "development") {
        res.send(msg + "<p>" + JSON.stringify(config) + "</p>");
    }
    else {
        res.send(msg);
    }
});
//config viriable PORT, e.g. 5000, default is 3000
var port = config.get("port");
//app.all('/',)
app.listen(port, function () {
    console.log(appName + " - Listening on port: #" + port);
});
