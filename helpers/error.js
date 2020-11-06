const fs = require("fs");
const { promisify } = require("util");

const appendFile = promisify(fs.appendFile);

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

const handleError = (err, res) => {
  const message = err.message;
  const statusCode = err.statusCode || 500;
  (async () => {
    await appendFile(
      "./logs/errorResponse.log",
      `[${new Date()}] error: ${statusCode} - ${message}\n`
    );
  })();
  res.status(statusCode).json({
    message: message,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
