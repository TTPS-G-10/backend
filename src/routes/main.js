const mainpage = require('./../controllers/mainpage');
const { Router } = require('express');
const router = Router();


router.get('/init', mainpage);

module.exports = router;