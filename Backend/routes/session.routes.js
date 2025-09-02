import { Router } from "express";
import sessionController from "../controllers/sessionController.js";

const router = Router();

router.post("/login", sessionController.login);
router.post("/logout", sessionController.logout);
router.get("/", sessionController.getSessions);

export default router;
