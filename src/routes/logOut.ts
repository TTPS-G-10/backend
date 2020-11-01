import logOut from "./../controllers/logOut";
import Router from "express";
const router = Router();

router.get("/logOut", logOut);

export default router;
