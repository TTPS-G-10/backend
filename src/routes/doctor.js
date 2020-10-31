const { Router } = require("express");
const router = Router();

const {
  createEvolution,
  admitPatient,
  listAlerts,
} = require("../controllers/doctor");

router.post("/createEvoluiton", createEvolution);
router.get("/alert", listAlerts);
router.post("/admintPatient", admitPatient);

module.exports = router;
