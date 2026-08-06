const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/technology.controller");

router.get("/", ctrl.getTechnologies);
router.post("/", ctrl.addTechnology);
router.put("/:id", ctrl.updateTechnology);
router.delete("/:id", ctrl.deleteTechnology);

module.exports = router;
