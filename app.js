// ./app.js

/**
 * Required External Modules
 */

// importing the dependencies
const compression = require("compression");
const express = require("express");
const path = require("path");
const fs = require("fs");
const debug = require("debug")("server");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const winston = require("winston");
const mongoose = require("mongoose");

// convert the body of incoming requests into JavaScript objects if express version < 4.16
// const bodyParser = require("body-parser");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "3001";
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      timestamp: true,
    }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "rejections.log" }),
  ],
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

/**
 *  App Configuration
 */

// for gzip compression
app.use(compression());

app.use(express.json());

// parse cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());

// adding Helmet to enhance your API security by defining various HTTP headers
app.use(helmet());

// enabling CORS
app.use(cors(corsOptions));

// adding morgan to log HTTP requests
app.use(morgan("combined", { stream: accessLogStream }));

// convert the body of incoming requests into JavaScript objects if express version < 4.16
// app.use(bodyParser.json());

/**
 * Routes Definitions
 */

// defining an endpoint
app.get("/", (req, res) => {
  res.status(200).send("WeCare: Extending Care For Devs");
});

/**
 * Server Activation
 */

// Connecting to MongoDB
mongoose.connect("mongodb://localhost:27017/weCare", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", function () {
  logger.error("Database connection error");
});
db.once("open", function () {
  logger.info("Database connection successful");
});

// starting the server
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

/**
 * Webpack HMR Activation
 */
