import mainpage from './../controllers/mainpage';
import Router from 'express';
const router = Router();


router.get('/init', mainpage);

export default router;