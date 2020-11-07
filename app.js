// ./app.js

/**
 * REQUIRED EXTERNAL MODULES
 */

// importing the dependencies
const express = require("express");
const compression = require("compression");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const winston = require("winston");
const mongoose = require("mongoose");
const cors = require("cors");
const mongooseIncrement = require("mongoose-increment");
const { handleError, ErrorHandler } = require("./helpers/error");
increment = mongooseIncrement(mongoose);
const users = require("./routes/users");
const coaches = require("./routes/coaches");

const moment = require("moment");
moment().format();

// convert the body of incoming requests into JavaScript objects if express version < 4.16
// const bodyParser = require("body-parser");

/**
 * APP VARIABLES
 */

const app = express();
const port = process.env.PORT || "3002";

// configure cors
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "/logs/access.log"),
  { flags: "a" }
);

// define winston error logger
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
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "debug",
    }),
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
// Call exceptions.handle with a transport to handle exceptions
logger.exceptions.handle(
  new winston.transports.File({ filename: "logs/exceptions.log" })
);
// Call rejections.handle with a transport to handle rejections
logger.rejections.handle(
  new winston.transports.File({ filename: "logs/rejections.log" })
);

/**
 *  APP CONFIGURATION
 */

// for gzip compression
app.use(compression());

// parse incoming requests with JSON payloads
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
 * ROUTES (ENDPOINTS) DEFINITION
 */

// user-specific routes
app.use("/users", users);

// coach-specific routes
app.use("/coaches", coaches);

// testing route
app.post("/test/:var/", (req, res, next) => {
  mongoose.models["Booking"]
    .find()
    .select({ slot: 1, _id: 0 })
    .where("coachId")
    .eq(req.params.var)
    .where("dateOfAppointment")
    .eq(req.body.dateOfAppointment)
    .exec(function (err, bookings) {
      if (err) return next(new ErrorHandler(err));

      // if (bookings.length === 0) res.send("Slot available");

      const [start, end] = req.body.slot.split(" to ");
      const startHours = moment(start, ["h A"]).format("HH");
      const endHours = moment(end, ["h A"]).format("HH");

      let slots = [];
      try {
        slots = bookings.reduce((acc, val) => [...acc, val.slot], []);
      } catch (e) {
        return next(e);
      }
      try {
        slots.forEach(function (v) {
          const [from, to] = v.split(" to ");
          const slotBeginning = moment(from, ["h A"]).format("HH");
          const slotEnding = moment(to, ["h A"]).format("HH");

          if (
            (startHours >= slotBeginning && startHours < slotEnding) ||
            (endHours > slotBeginning && endHours <= slotEnding) ||
            (startHours <= slotBeginning && endHours >= slotEnding)
          ) {
            throw new ErrorHandler(
              "There is an appointment in this slot already",
              400
            );
          }
        });

        res.send("Slot available");
      } catch (error) {
        return next(error);
      }
    });
});

// handle all invalid requests
app.all("*", (req, res, next) => {
  next(new ErrorHandler("Invalid Path", 404));
});

// middleware for custom error handling
app.use((err, req, res, next) => {
  handleError(err, res);
});

/**
 * SERVER ACTIVATION
 */

// connecting to MongoDB
mongoose.connect("mongodb://localhost:27017/weCare", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", function (err) {
  logger.error("Database connection error");
  next(err);
});
db.once("open", function () {
  logger.info("Database connection successful");
});

// starting the server
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

/**
 * WEBPACK HMR ACTIVATION
 */
