const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const Coach = require("../models/coach");
const { ErrorHandler } = require("../helpers/error");

// middleware that is specific to this router

// define the coach registration route
router.post(
  "/",
  [
    body("name").trim().escape(),
    body("gender").trim().escape(),
    body("dateOfBirth").trim().escape(),
    body("mobileNumber").trim().escape(),
    body("speciality").trim().escape(),
  ],
  (req, res) => {
    res.status(200).send("WeCare: Extending Care For Devs");
  }
);
// define the coach login route
router.post("/login", [body("id").trim().escape()], (req, res) => {
  res.status(200).send("WeCare: Extending Care For Devs");
});
// define the route to enlist all available coaches
router.get("/all", (req, res) => {
  Coach.find({}).exec((err, coaches) => {
    if (err) throw new ErrorHandler(err);
    res.status(200).send(coaches);
  });
});
// define the route to return the details of a specific coach
router.get("/:coachId", (req, res) => {
  res.status(200).send(req.params);
});
// define the route to return all appointments for a coach
router.get("/booking/:coachId", (req, res) => {
  res.status(200).send(req.params);
});

module.exports = router;
