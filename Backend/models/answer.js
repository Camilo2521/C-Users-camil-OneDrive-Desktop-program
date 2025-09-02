import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Answer = sequelize.define(
    "Answer",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      response: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // 👈 Usa el nombre del modelo definido en User
          key: "id",
        },
        onDelete: "CASCADE",
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Questions", // 👈 Usa el nombre del modelo definido en Question
          key: "id",
        },
        onDelete: "CASCADE",
      },
      diagnosisId: {
        type: DataTypes.INTEGER,
        allowNull: true, // puede estar vacío si aún no hay diagnóstico
        references: {
          model: "Diagnoses", // 👈 Usa el nombre del modelo definido en Diagnosis
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "answers",
      timestamps: true,
    }
  );

  return Answer;
};


