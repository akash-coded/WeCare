const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// Require controller modules.
const booking_controller = require("../controllers/bookingController");

// define the route to reschedule or cancel an existing appointment
router
  .route("/:bookingId")
  .put(
    [body("slot").trim().escape(), body("dateOfAppointment").trim().escape()],
    booking_controller.update_booking
  )
  .delete(booking_controller.delete_booking);

module.exports = router;
