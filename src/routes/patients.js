const patients = require('./../controllers/patients');
const { Router } = require('express');
const router = Router();


router.get('/patients', patients);

module.exports = router;