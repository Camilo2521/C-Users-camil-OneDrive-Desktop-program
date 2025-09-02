import { Router } from "express";
import answerController from "../controllers/answerController.js";

const router = Router();

// CRUD de respuestas
router.post("/", answerController.createAnswer);       // Crear
router.get("/", answerController.getAnswers);          // Listar todas
router.get("/:id", answerController.getAnswerById);    // Obtener por ID
router.put("/:id", answerController.updateAnswer);     // Actualizar
router.delete("/:id", answerController.deleteAnswer);  // Eliminar

export default router;
