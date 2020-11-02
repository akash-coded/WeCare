const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  BookingId: String,
  UserId: String,
  CoachId: String,
  AppointmentDate: Date,
  Slot: String,
});

module.exports = mongoose.model("Booking", bookingSchema);
