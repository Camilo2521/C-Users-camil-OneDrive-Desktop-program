import { Question, Answer } from "../models/index.js";

const questionController = {
  // 📌 Crear pregunta
  async createQuestion(req, res, next) {
    try {
      const { text, type } = req.body;
      const question = await Question.create({ text, type });
      res.status(201).json(question);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Obtener todas las preguntas
  async getQuestions(req, res, next) {
    try {
      const questions = await Question.findAll({ include: Answer });
      res.json(questions);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Obtener pregunta por ID
  async getQuestionById(req, res, next) {
    try {
      const { id } = req.params;
      const question = await Question.findByPk(id, { include: Answer });

      if (!question)
        return res.status(404).json({ error: "Pregunta no encontrada" });

      res.json(question);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Actualizar pregunta
  async updateQuestion(req, res, next) {
    try {
      const { id } = req.params;
      const { text, type } = req.body;

      const question = await Question.findByPk(id);
      if (!question)
        return res.status(404).json({ error: "Pregunta no encontrada" });

      await question.update({ text, type });
      res.json(question);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Eliminar pregunta
  async deleteQuestion(req, res, next) {
    try {
      const { id } = req.params;
      const question = await Question.findByPk(id);

      if (!question)
        return res.status(404).json({ error: "Pregunta no encontrada" });

      await question.destroy();
      res.json({ message: "Pregunta eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  },

  // 📌 Sembrar preguntas predefinidas (sistema endocrino)
  async seedQuestions(req, res, next) {
    try {
      const questionsData = [
        { text: "¿Sientes cansancio excesivo?", type: "boolean" },
        { text: "¿Has tenido aumento de peso sin razón aparente?", type: "boolean" },
        { text: "¿Notas la piel seca con frecuencia?", type: "boolean" },
        { text: "¿Tienes sed excesiva a lo largo del día?", type: "boolean" },
        { text: "¿Orinas con mucha frecuencia?", type: "boolean" },
        { text: "¿Has perdido peso de manera inexplicable?", type: "boolean" },
      ];

      // Evitar duplicados: solo crear si no existen
      for (const q of questionsData) {
        await Question.findOrCreate({
          where: { text: q.text },
          defaults: q,
        });
      }

      const allQuestions = await Question.findAll();
      res.json({ message: "Preguntas endocrinas creadas", data: allQuestions });
    } catch (error) {
      next(error);
    }
  },
};

export default questionController;
