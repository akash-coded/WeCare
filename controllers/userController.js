const express = require("express");
const sanitize = require("mongo-sanitize");
const User = require("../models/user");

exports.index = (req, res) => {
  res.status(200).send("WeCare: Extending Care For Devs");
};
