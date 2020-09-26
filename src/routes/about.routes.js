const {Router} = require('express');
const router = Router();

const {showHi} = require('../controllers/about.controllers');

router.get('/',showHi);

module.exports = router;