const { Router } = require("express");
const router = Router();

const { createEvaluation } = require("../model/Hospital");

router.post("/createEvaluation", createEvaluation);
router.get("/alert", listAlerts);
router.post("/admintPatient", admintPatient);

module.exports = router;
