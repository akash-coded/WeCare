const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// Require controller modules.
const coach_controller = require("../controllers/coachController");

/// COACH ROUTES ///

// define the route to return all appointments for a coach
router.get("/booking/:coachId", coach_controller.fetch_coach_appointments);

// define the route to enlist all available coaches
router.get("/all", coach_controller.fetch_all_coaches);

// define the coach login route
router.post(
  "/login",
  [body("id").trim().escape()],
  coach_controller.login_coach
);

// define the route to return the details of a specific coach
router.get("/:coachId", coach_controller.fetch_coach_details);

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
  coach_controller.register_coach
);

module.exports = router;
