const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const appendFile = promisify(fs.appendFile);

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  const statusCode = err.statusCode || 500;
  const message = err.message;
  (async () => {
    await appendFile(
      "./logs/errorResponse.log",
      `[${new Date()}] error: ${statusCode} - ${message}\n`
    );
  })();
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
