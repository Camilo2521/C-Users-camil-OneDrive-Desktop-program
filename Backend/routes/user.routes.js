import { Router } from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";

const router = Router();

router.post("/", userController.createUser); // Registro público
router.get("/", authMiddleware, authorize("admin"), userController.getUsers);
router.get("/:id", authMiddleware, authorize(["admin", "teacher"]), userController.getUserById);
router.put("/:id", authMiddleware, authorize(["admin", "teacher"]), userController.updateUser);
router.delete("/:id", authMiddleware, authorize("admin"), userController.deleteUser);

export default router;
