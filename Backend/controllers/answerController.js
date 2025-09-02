import { Answer, User, Question, Diagnosis } from "../models/index.js";
import { Engine } from "json-rules-engine";

// ⚡ Reglas endocrinas
const rules = [
  {
    conditions: {
      all: [
        { fact: "symptoms", operator: "contains", value: "cansancio" },
        { fact: "symptoms", operator: "contains", value: "piel seca" },
        { fact: "symptoms", operator: "contains", value: "aumento de peso" }
      ]
    },
    event: {
      type: "diagnosis",
      params: {
        result: "Hipotiroidismo",
        notes: "Síntomas compatibles con hipotiroidismo. Recomendado análisis TSH y T4."
      }
    }
  },
  {
    conditions: {
      all: [
        { fact: "symptoms", operator: "contains", value: "sed excesiva" },
        { fact: "symptoms", operator: "contains", value: "orina frecuente" },
        { fact: "symptoms", operator: "contains", value: "pérdida de peso" }
      ]
    },
    event: {
      type: "diagnosis",
      params: {
        result: "Diabetes Mellitus",
        notes: "Posible diabetes mellitus. Recomendado glucemia en ayunas y HbA1c."
      }
    }
  }
];

const engine = new Engine(rules);

const answerController = {
  // 📌 Crear respuesta
  async createAnswer(req, res, next) {
    try {
      const { userId, questionId, diagnosisId, response } = req.body;

      // Validaciones
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      const question = await Question.findByPk(questionId);
      if (!question) return res.status(404).json({ error: "Pregunta no encontrada" });

      const diagnosis = await Diagnosis.findByPk(diagnosisId);
      if (!diagnosis) return res.status(404).json({ error: "Diagnóstico no encontrado" });

      // Guardar respuesta
      const answer = await Answer.create({
        userId,
        questionId,
        diagnosisId,
        response,
      });

      // 🔹 Obtener todas las respuestas previas del diagnóstico
      const answers = await Answer.findAll({
        where: { diagnosisId },
      });

      // Extraer síntomas (respuestas positivas)
      const symptoms = answers.map((a) => a.response.toLowerCase());

      // Ejecutar motor de reglas
      const results = await engine.run({ symptoms });

      if (results.events.length > 0) {
        // Actualizar diagnóstico con el resultado más reciente
        const { result, notes } = results.events[0].params;
        await diagnosis.update({ result, notes });
      }

      res.status(201).json(answer);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Obtener todas las respuestas
  async getAnswers(req, res, next) {
    try {
      const answers = await Answer.findAll({
        include: [User, Question, Diagnosis],
      });
      res.json(answers);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Obtener una respuesta por ID
  async getAnswerById(req, res, next) {
    try {
      const { id } = req.params;
      const answer = await Answer.findByPk(id, {
        include: [User, Question, Diagnosis],
      });

      if (!answer) return res.status(404).json({ error: "Respuesta no encontrada" });

      res.json(answer);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Actualizar respuesta
  async updateAnswer(req, res, next) {
    try {
      const { id } = req.params;
      const { response } = req.body;

      const answer = await Answer.findByPk(id);
      if (!answer) return res.status(404).json({ error: "Respuesta no encontrada" });

      await answer.update({ response });
      res.json(answer);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Eliminar respuesta
  async deleteAnswer(req, res, next) {
    try {
      const { id } = req.params;
      const answer = await Answer.findByPk(id);

      if (!answer) return res.status(404).json({ error: "Respuesta no encontrada" });

      await answer.destroy();
      res.json({ message: "Respuesta eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  },
};

export default answerController;
