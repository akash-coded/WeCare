const mongoose = require("mongoose");
const moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { ErrorHandler } = require("../helpers/error");
const Schema = mongoose.Schema;
const sanitize = require("mongo-sanitize");
const uniqueValidator = require("mongoose-unique-validator");

moment().format();

/// SCHEMA ///

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name should have minimum 3 and maximum 50 characters"],
      maxlength: [50, "Name should have minimum 3 and maximum 50 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [
        5,
        "Password should have minimum 5 and maximum 10 characters",
      ],
      maxlength: [
        10,
        "Password should have minimum 5 and maximum 10 characters",
      ],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      trim: true,
      enum: {
        values: ["F", "M"],
        message: "Gender should be either M or F",
      },
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of Birth is required"],
      min: [
        moment().subtract(100, "years"),
        "Age should be greater than 20 and less than 100",
      ],
      max: [
        moment().subtract(20, "years"),
        "Age should be greater than 20 and less than 100",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      index: true,
      uniqueCaseInsensitive: true,
      match: [/[^@]+@[^\.]+\.com/, "Email should be a valid one"],
    },
    mobileNumber: {
      type: Number,
      required: [true, "Mobile Number is required"],
      min: [1000000000, "Mobile Number should have 10 digits"],
      max: [9999999999, "Mobile Number should have 10 digits"],
    },
    pincode: {
      type: Number,
      required: [true, "Pincode is required"],
      min: [100000, "Pincode should have 6 digits"],
      max: [999999, "Pincode should have 6 digits"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [3, "City should have minimum 3 and maximum 20 characters"],
      maxlength: [20, "City should have minimum 3 and maximum 20 characters"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      minlength: [3, "State should have minimum 3 and maximum 20 characters"],
      maxlength: [20, "State should have minimum 3 and maximum 20 characters"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      minlength: [3, "Country should have minimum 3 and maximum 20 characters"],
      maxlength: [
        20,
        "Country should have minimum 3 and maximum 20 characters",
      ],
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    runValidators: true,
    context: "query",
  }
);

/// VIRTUALS ///

// create a virtual property `age` that's computed from `dateOfBirth`.
userSchema.virtual("age").get(function () {
  return moment().diff(this.dateOfBirth, "years");
});

/// QUERY HELPERS ///

userSchema.query.byUserId = function (userId) {
  return this.where({ userId: new RegExp(userId, "i") });
};

/// PLUGINS ///

userSchema.plugin(uniqueValidator, {
  message: "User exists with this email id",
});

userSchema.plugin(increment, {
  type: String,
  modelName: "User",
  fieldName: "userId",
  prefix: "UI-000",
  start: 0,
  increment: 1,
});

/// MODEL HOOKS ///

userSchema.pre("save", function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, saltRounds, function (err, hash) {
    if (err) return next(new ErrorHandler(err));
    // override the plaintext password with the hashed one
    user.password = hash;
    next();
  });
});

/// INSTANCE METHODS ///

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callback(new ErrorHandler(err));
    callback(null, isMatch);
  });
};

/// STATICS ///

// Assign a function to the "statics" object of our animalSchema
userSchema.statics.createOne = function (data, callback) {
  return this.create(
    {
      name: sanitize(data.name),
      password: data.password,
      dateOfBirth: sanitize(data.dateOfBirth),
      gender: sanitize(data.gender),
      mobileNumber: sanitize(data.mobileNumber),
      email: sanitize(data.email),
      pincode: sanitize(data.pincode),
      city: sanitize(data.city),
      state: sanitize(data.state),
      country: sanitize(data.country),
    },
    callback
  );
};

userSchema.statics.findByUserId = function (userId, callback) {
  return this.findOne().where("userId").eq(sanitize(userId)).exec(callback);
};

module.exports = mongoose.model("User", userSchema);
