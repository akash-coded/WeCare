const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userId: String,
    name: String,
    password: String,
    gender: String,
    dateOfBirth: Date,
    email: String,
    mobileNumber: String,
    pincode: Number,
    city: String,
    state: String,
    country: String,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

module.exports = mongoose.model("User", userSchema);
