import { Router } from "express";
import questionController from "../controllers/questionController.js";
import authMiddleware from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";

const router = Router();

// 📌 Solo teachers pueden crear, actualizar y borrar
router.post("/", authMiddleware, authorize("teacher"), questionController.createQuestion);
router.put("/:id", authMiddleware, authorize("teacher"), questionController.updateQuestion);
router.delete("/:id", authMiddleware, authorize("teacher"), questionController.deleteQuestion);

// 📌 Todos los usuarios autenticados pueden ver
router.get("/", authMiddleware, questionController.getQuestions);
router.get("/:id", authMiddleware, questionController.getQuestionById);

export default router;
