const Joi = require("@hapi/joi");
const router = require("express").Router();

let entities = [
  { id: 0, name: "A" },
  { id: 1, name: "B" },
  { id: 2, name: "C" },
  { id: 3, name: "D" }
];

function validateSchema(entity:any) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(entity);
  return error;
}

router.put("/:id", (req:any, res:any) => {
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

router.get("/", (req:any, res:any) => {
  res.send(entities);
});

router.get("/:id", (req:any, res:any) => {
  let id = req.params.id;
  let o = entities.find((e) => e.id === +id);

  if (o) res.send(o);
  else res.status(404).send("Entity not found");
});

router.post("", (req:any, res:any) => {
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

module.exports = router;
