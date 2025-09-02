// seeders/seed.js
import { sequelize } from '../models/index.js';
import User from '../models/user.js';
import Diagnosis from '../models/diagnosis.js';
import Question from '../models/question.js';

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // borra y recrea tablas

    console.log('🔄 Poblando la base de datos...');

    // Usuarios de ejemplo
    const users = await User.bulkCreate([
      { name: 'Camilo', email: 'camilo@example.com', password: '123456' },
      { name: 'Ana', email: 'ana@example.com', password: '654321' },
    ]);

    // Diagnósticos de ejemplo
    const diagnoses = await Diagnosis.bulkCreate([
      { name: 'Hipotiroidismo', description: 'Trastorno en el que la glándula tiroides no produce suficiente hormona.' },
      { name: 'Diabetes Tipo 2', description: 'Condición que afecta la forma en que el cuerpo procesa la glucosa.' },
    ]);

    // Preguntas de ejemplo
    const questions = await Question.bulkCreate([
      { text: '¿Ha sentido fatiga constante en los últimos días?', diagnosisId: diagnoses[0].id },
      { text: '¿Ha notado aumento de peso sin razón aparente?', diagnosisId: diagnoses[0].id },
      { text: '¿Siente mucha sed con frecuencia?', diagnosisId: diagnoses[1].id },
      { text: '¿Orina con frecuencia, incluso en la noche?', diagnosisId: diagnoses[1].id },
    ]);

    console.log('✅ Base de datos poblada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();
