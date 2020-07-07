
//set DEBUG environmental variable to sss:db, etc
const debug = require('debug')('SSS');
const cors = require('cors');
const config = require("config");
const morgan = require("morgan");
//import {router as entitiesRouter}  from './routes/entities';
const entitiesRouter = require('./routes/entities') 

const express = require("express");
const helmet = require("helmet");
const logger = require("./middleware/logger");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use('/api/entities',entitiesRouter);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan: logging enabled");
}

//alternative location for deployment of Agnular dist files
app.use(express.static("./public"));
app.use(logger);


debug('mail.password: ' + config.get('mail.password'));

let appName = config.get("name");
let msg = `${appName} is up and running`;
app.get("/", (req:any, res:any) => {
  if (app.get("env") === "development") {
    res.send(msg + "<p>" + JSON.stringify(config) + "</p>");
  } else {
    res.send(msg);
  }
});

//config viriable PORT, e.g. 5000, default is 3000
const port = config.get("port");

//app.all('/',)
app.listen(port, () => {
  console.log(`${appName} - Listening on port: #${port}`);
});
