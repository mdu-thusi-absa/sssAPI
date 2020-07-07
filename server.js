
const cors = require('cors');
const config = require("config");
const morgan = require("morgan");
const Joi = require("@hapi/joi");
const express = require("express");
const helmet = require("helmet");
const logger = require("./logger");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan: logging enabled");
}
// console.log('App name:' + config.get('name'));
// console.log('Mail server:' + config.get('mail.host'));

//alternative location for deployment of Agnular dist files
app.use(express.static("./public"));

app.use(logger);

let appName = config.get("name");
let msg = `${appName} is up and running`;
app.get("/", (req, res) => {
  if (app.get("env") === "development") {
    res.send(msg + "<p>" + JSON.stringify(config) + "</p>");
  } else {
    res.send(msg);
  }
});

let entities = [
  { id: 0, name: "A" },
  { id: 1, name: "B" },
  { id: 2, name: "C" },
];

function validateSchema(entity) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(entity);
  return error;
}

app.put("/api/entities/:id", (req, res) => {
  let id = req.params.id;

  const error = validateSchema(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let o = entities.find((e) => e.id === +id);

  if (o) {
    o.name = req.body.name;
    res.send(o);
  } else res.status(404).send("Entity not found");
});

app.get("/api/entities", (req, res) => {
  res.send(entities);
});

app.get("/api/entities/:id", (req, res) => {
  let id = req.params.id;
  let o = entities.find((e) => e.id === +id);

  if (o) res.send(o);
  else res.status(404).send("Entity not found");
});

app.post("/api/entities", (req, res) => {
  const error = validateSchema(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let id = entities.length;
  let entity = { id: id, name: req.body.name };
  entities.push(entity);

  res.send(entity);
});

//config viriable PORT, e.g. 5000, default is 3000
const port = config.get("port");

//app.all('/',)
app.listen(port, () => {
  console.log(`${appName} - Listening on port ${port}`);
});
