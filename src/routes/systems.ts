import systems from './../controllers/systems';
import Router from 'express';
const router = Router();

router.get('/systems',systems);

export default router;