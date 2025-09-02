import { User, Session } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Tiempo de expiración del token
const TOKEN_EXPIRATION = "2000h"; // puedes cambiarlo
const SECRET = process.env.JWT_SECRET;

const sessionController = {
  // 📌 Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });

      // Crear token JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );

      // Guardar sesión en DB
      const session = await Session.create({
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
      });

      res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
      next(error);
    }
  },

  // 📌 Logout
  async logout(req, res, next) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "No token provided" });

      await Session.destroy({ where: { token } });
      res.json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
      next(error);
    }
  },

  // 📌 Listar sesiones (solo admin)
  async getSessions(req, res, next) {
    try {
      const sessions = await Session.findAll({
        include: { model: User, attributes: ["id", "name", "email", "role"] }
      });
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  },
};

export default sessionController;
