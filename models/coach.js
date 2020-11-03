const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coachSchema = new Schema(
  {
    coachId: String,
    name: String,
    password: String,
    gender: String,
    dateOfBirth: Date,
    mobileNumber: Number,
    speciality: String,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

module.exports = mongoose.model("Coach", coachSchema);
