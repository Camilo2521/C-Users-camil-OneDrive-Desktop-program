import { Sequelize } from "sequelize";
import dotenv from "dotenv";

import UserModel from "./user.js";
import SessionModel from "./session.js";
import QuestionModel from "./question.js";
import AnswerModel from "./answer.js";
import DiagnosisModel from "./diagnosis.js";

dotenv.config();

// Conexión a la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // opcional, quita logs de SQL
  }
);

// Inicializar modelos
const User = UserModel(sequelize);
const Session = SessionModel(sequelize);
const Question = QuestionModel(sequelize);
const Answer = AnswerModel(sequelize);
const Diagnosis = DiagnosisModel(sequelize);

// ======================
// Definir asociaciones
// ======================

// User - Session
User.hasMany(Session, { foreignKey: "userId" });
Session.belongsTo(User, { foreignKey: "userId" });

// User - Diagnosis
User.hasMany(Diagnosis, { foreignKey: "userId" });
Diagnosis.belongsTo(User, { foreignKey: "userId" });

// Question - Answer
Question.hasMany(Answer, { foreignKey: "questionId" });
Answer.belongsTo(Question, { foreignKey: "questionId" });

// Diagnosis - Answer
Diagnosis.hasMany(Answer, { foreignKey: "diagnosisId" });
Answer.belongsTo(Diagnosis, { foreignKey: "diagnosisId" });

// User - Answer (opcional, si quieres saber quién respondió)
User.hasMany(Answer, { foreignKey: "userId" });
Answer.belongsTo(User, { foreignKey: "userId" });

// Exportar todos juntos
export {
  sequelize,
  User,
  Session,
  Question,
  Answer,
  Diagnosis,
};
