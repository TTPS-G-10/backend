const auth = require('./../controllers/auth');
const { Router } = require('express');
const router = Router();


router.post('/authenticate', auth);

module.exports = router;