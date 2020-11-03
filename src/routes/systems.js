const systems = require('./../controllers/systems');
const { Router } = require('express');
const router = Router();


router.get('/systems',systems);

module.exports = router;