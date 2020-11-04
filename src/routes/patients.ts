import patients from'../controllers/patients';
import Router from "express";
const router = Router();

router.get('/patients', patients);

export default router;