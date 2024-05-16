const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.statusText || "Internal Server Error",
    message: err.message,
    statusCode: err.statusCode || 500,
    stack: err.stack
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Route not found: ${req.originalUrl}`,
    statusCode: 404
  });
};

export { errorHandler, notFound };
