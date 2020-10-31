const logOut = require("./../controllers/logOut");
const { Router } = require("express");
const router = Router();

router.get("/logOut", logOut);

module.exports = router;
