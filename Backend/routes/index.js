import { Router } from "express";
import userRoutes from "./user.routes.js";
import sessionRoutes from "./session.routes.js";
import questionRoutes from "./question.routes.js";
import answerRoutes from "./answer.routes.js";
import diagnosisRoutes from "./diagnosis.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/sessions", sessionRoutes);
router.use("/questions", questionRoutes);
router.use("/answers", answerRoutes);
router.use("/diagnoses", diagnosisRoutes);

export default router;
