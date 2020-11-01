// app.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const debug = require("debug")("server");
const helmet = require("helmet");
const cors = require("cors");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";
const corsOptions = {
  origin: "http://localhost:8000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

/**
 *  App Configuration
 */

app.use(helmet());
app.use(express.json());
// app.use(cors(corsOptions));

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
  res.status(200).send("WeCare: Extending Care For Devs");
});

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

/**
 * Webpack HMR Activation
 */
