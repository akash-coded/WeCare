const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  UserId: String,
  Name: String,
  Password: String,
  Gender: String,
  DateOfBirth: Date,
  Email: String,
  MobileNumber: String,
  PinCode: Number,
  City: String,
  State: String,
  Country: String,
});

module.exports = mongoose.model("User", userSchema);
