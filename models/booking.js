const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { User } = require("user");
const { Coach } = require("coach");

const bookingSchema = new Schema(
  {
    bookingId: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    coachId: { type: Schema.Types.ObjectId, ref: "Coach" },
    dateOfAppointment: Date,
    slot: String,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
