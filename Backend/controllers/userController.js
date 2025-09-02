import { User } from "../models/index.js";
import bcrypt from "bcrypt";

const userController = {
  // 📌 Crear usuario (hash de contraseña)
  async createUser(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      // Verificar si ya existe el correo
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "El correo ya está registrado" });
      }

      // Hash de contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      // Excluir contraseña en la respuesta
      const { password: _, ...userData } = newUser.get({ plain: true });

      res.status(201).json(userData);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Obtener todos los usuarios (sin contraseñas)
  async getUsers(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Obtener un usuario por ID (sin contraseña)
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Actualizar usuario (opcionalmente actualizar contraseña)
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, role, password } = req.body;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      let updatedFields = { name, email, role };

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedFields.password = hashedPassword;
      }

      await user.update(updatedFields);

      const { password: _, ...userData } = user.get({ plain: true });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Eliminar usuario
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      await user.destroy();
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
