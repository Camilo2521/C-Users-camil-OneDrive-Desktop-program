import { Diagnosis, User } from "../models/index.js";
import { Engine } from "json-rules-engine";

// 🔹 Reglas médicas básicas del sistema endocrino
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
        notes: "Síntomas compatibles con hipotiroidismo. Se recomienda análisis de TSH y T4."
      }
    }
  },
  {
    conditions: {
      all: [
        { fact: "symptoms", operator: "contains", value: "pérdida de peso" },
        { fact: "symptoms", operator: "contains", value: "sed excesiva" },
        { fact: "symptoms", operator: "contains", value: "orina frecuente" }
      ]
    },
    event: {
      type: "diagnosis",
      params: {
        result: "Diabetes Mellitus",
        notes: "Posible diabetes mellitus. Se recomienda glucemia en ayunas y HbA1c."
      }
    }
  },
  {
    conditions: {
      all: [
        { fact: "symptoms", operator: "contains", value: "taquicardia" },
        { fact: "symptoms", operator: "contains", value: "ansiedad" },
        { fact: "symptoms", operator: "contains", value: "pérdida de peso" }
      ]
    },
    event: {
      type: "diagnosis",
      params: {
        result: "Hipertiroidismo",
        notes: "Síntomas compatibles con hipertiroidismo. Se recomienda examen de T3, T4 y TSH."
      }
    }
  }
];

const engine = new Engine(rules);

const diagnosisController = {
  // 📌 Crear diagnóstico basado en síntomas
  async createDiagnosis(req, res, next) {
    try {
      const { userId, symptoms } = req.body; // 👉 ahora recibe un array de síntomas

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      // Evaluar reglas
      const facts = { symptoms };
      const results = await engine.run(facts);

      let result = "Sin diagnóstico endocrino";
      let notes = "No se encontraron coincidencias con las reglas endocrinas.";

      if (results.events.length > 0) {
        result = results.events[0].params.result;
        notes = results.events[0].params.notes;
      }

      // Guardar diagnóstico
      const diagnosis = await Diagnosis.create({ userId, result, notes });
      res.status(201).json(diagnosis);
    } catch (error) {
      next(error);
    }
  },

  // 📌 Obtener todos
  async getDiagnoses(req, res, next) {
    try {
      const diagnoses = await Diagnosis.findAll({ include: User });
      res.json(diagnoses);
    } catch (error) {
      next(error);
    }
  }
};

export default diagnosisController;
