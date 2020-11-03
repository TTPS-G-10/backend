const adminsys = require('./../controllers/adminsys');
const { Router } = require('express');
const router = Router();


router.get('/adminsys',adminsys);

module.exports = router;