const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// Require controller modules.
const user_controller = require("../controllers/userController");
const booking_controller = require("../controllers/bookingController");

/// USER ROUTES ///

// define the route for an user to make an appointment
router.post(
  "/booking/:userId/:coachId",
  [[body("slot").trim().escape(), body("dateOfAppointment").trim().escape()]],
  booking_controller.create_booking
);

// define the route to return all appointments made by the user
router.get("/booking/:userId", booking_controller.fetch_user_appointments);

// define the user login route
router.post("/login", [body("id").trim().escape()], user_controller.login_user);

// define the user details route
router.get("/:userId", user_controller.fetch_user_details);

// define the user registration route
router.post(
  "/",
  [
    body("name").trim().escape(),
    body("gender").trim().escape(),
    body("dateOfBirth").trim().escape(),
    body("mobileNumber").trim().escape(),
    body("email").normalizeEmail(),
    body("pincode").trim().escape(),
    body("city").trim().escape(),
    body("state").trim().escape(),
    body("country").trim().escape(),
  ],
  user_controller.register_user
);

module.exports = router;
