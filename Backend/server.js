import express from "express";
import { sequelize } from "./models/index.js";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Todas las rutas agrupadas en /api
app.use("/api", routes);
app.use(errorHandler);

// Sincronización DB y levantar servidor
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada correctamente");

    await sequelize.sync({ alter: true }).then(() => {
      console.log("Tablas sincronizadas correctamente!");
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`)
    );
  } catch (err) {
    console.error("❌ Error al iniciar el servidor", err);
  }
})();

