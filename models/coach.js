const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({
  CoachId: String,
  Name: String,
  Password: String,
  Gender: String,
  DateOfBirth: Date,
  MobileNumber: Number,
  Specialty: String,
});

module.exports = mongoose.model("Coach", coachSchema);
