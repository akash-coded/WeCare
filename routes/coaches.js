const express = require("express");
const router = express.Router();

// middleware that is specific to this router

// define the coach registration route
router.post("/coaches", (req, res) => {
  res.status(200).send("WeCare: Extending Care For Devs");
});
// define the coach login route
router.post("/coaches/login", (req, res) => {
  res.status(200).send("WeCare: Extending Care For Devs");
});
// define the route to enlist all available coaches
router.get("/coaches/all", (req, res) => {
  res.status(200).send("WeCare: Extending Care For Devs");
});
// define the route to return the details of a specific coach
router.get("/coaches/:coachId", (req, res) => {
  res.status(200).send(req.params);
});
// define the route to return all appointments for a coach
router.get("/coaches/booking/:coachId", (req, res) => {
  res.status(200).send(req.params);
});

module.exports = router;
