import adminsys from './../controllers/adminsys';
import Router from 'express';
const router = Router();

router.get('/adminsys',adminsys);

export default router;