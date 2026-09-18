export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    err.statusCode = 422;
    err.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (err.code === 11000) {
    err.statusCode = 409;
    err.message = `${Object.keys(err.keyValue)[0]} is already registered`;
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(err.errors && { errors: err.errors }),
  });
};
