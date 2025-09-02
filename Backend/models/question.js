import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Question = sequelize.define(
    "Question",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("open", "multiple", "boolean"),
        allowNull: false,
        defaultValue: "open",
      },
    },
    {
      tableName: "questions", // 👈 siempre minúscula y plural
      timestamps: true, // createdAt y updatedAt
    }
  );

  return Question;
};
