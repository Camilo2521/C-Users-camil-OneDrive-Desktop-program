import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, Session } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const sessionController = {
  // 📌 Login (iniciar sesión)
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(401).json({ error: "Contraseña incorrecta" });

      // Generar token JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Guardar sesión en la BD
      const session = await Session.create({
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      res.json({
        message: "✅ Login exitoso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        session,
      });
    } catch (error) {
      next(error);
    }
  },

  // 📌 Logout (cerrar sesión)
  async logout(req, res, next) {
    try {
      const { token } = req.body;

      const session = await Session.findOne({ where: { token } });
      if (!session)
        return res.status(404).json({ error: "Sesión no encontrada" });

      await session.destroy();
      res.json({ message: "✅ Logout exitoso" });
    } catch (error) {
      next(error);
    }
  },

  // 📌 Ver sesiones activas
  async getSessions(req, res, next) {
    try {
      const sessions = await Session.findAll({ include: User });
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Verificar token
  async verifyToken(req, res, next) {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) return res.status(401).json({ error: "Token requerido" });

      const token = authHeader.split(" ")[1];
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token inválido o expirado" });
        req.user = decoded; // { id, role }
        next();
      });
    } catch (error) {
      next(error);
    }
  },

  // 📌 Middleware para validar roles
  authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      if (!req.user) return res.status(401).json({ error: "No autenticado" });
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: "No tienes permisos" });
      }
      next();
    };
  },
};

export default sessionController;
