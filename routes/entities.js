"use strict";
var Joi = require("@hapi/joi");
var router = require("express").Router();
var entities = [
    { id: 0, name: "A" },
    { id: 1, name: "B" },
    { id: 2, name: "C" },
    { id: 3, name: "D" }
];
function validateSchema(entity) {
    var schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    var error = schema.validate(entity).error;
    return error;
}
router.put("/:id", function (req, res) {
    var id = req.params.id;
    var error = validateSchema(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    var o = entities.find(function (e) { return e.id === +id; });
    if (o) {
        o.name = req.body.name;
        res.send(o);
    }
    else
        res.status(404).send("Entity not found");
});
router.get("/", function (req, res) {
    res.send(entities);
});
router.get("/:id", function (req, res) {
    var id = req.params.id;
    var o = entities.find(function (e) { return e.id === +id; });
    if (o)
        res.send(o);
    else
        res.status(404).send("Entity not found");
});
router.post("", function (req, res) {
    var error = validateSchema(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    var id = entities.length;
    var entity = { id: id, name: req.body.name };
    entities.push(entity);
    res.send(entity);
});
module.exports = router;
