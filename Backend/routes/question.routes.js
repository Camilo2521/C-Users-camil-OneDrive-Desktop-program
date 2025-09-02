import { Router } from "express";
import questionController from "../controllers/questionController.js";

const router = Router();

// CRUD de preguntas
router.post("/", questionController.createQuestion);       // Crear
router.get("/", questionController.getQuestions);          // Listar todas
router.get("/:id", questionController.getQuestionById);    // Obtener por ID
router.put("/:id", questionController.updateQuestion);     // Actualizar
router.delete("/:id", questionController.deleteQuestion);  // Eliminar

export default router;
