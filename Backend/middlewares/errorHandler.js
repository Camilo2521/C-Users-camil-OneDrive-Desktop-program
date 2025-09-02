export default function errorHandler(err, req, res, next) {
  console.error("🔥 Error detectado:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // Código de estado (si no viene, se asume 500)
  const status = err.status || 500;

  // Mensaje amigable para el cliente
  let message = "Ocurrió un error interno en el servidor";

  // Si el error viene con mensaje claro, lo usamos
  if (err.message && status < 500) {
    message = err.message;
  }

  // Errores comunes de Sequelize
  if (err.name === "SequelizeValidationError") {
    message = err.errors.map((e) => e.message).join(", ");
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    message = "Ya existe un registro con esos datos únicos";
  }

  res.status(status).json({
    success: false,
    error: message,
  });
}
