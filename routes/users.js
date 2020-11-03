const express = require("express");
const router = express.Router();

// middleware that is specific to this router

// define the user registration route
router.post("/", (req, res) => {
  res.status(200).send("WeCare: Extending Care For Devs");
});
// define the user login route
router.post("/login", (req, res) => {
  res.status(200).send("WeCare: Extending Care For Devs");
});
// define the user details route
router.get("/:userId", (req, res) => {
  res.status(200).send(req.params);
});
// define the route to reschedule or cancel an existing appointment
router
  .route("/booking/:bookingId")
  .put((req, res) => {
    res.status(200).send(req.params);
  })
  .delete((req, res) => {
    res.status(200).send(req.params);
  });
// define the route to return all appointments made by the user
router.get("/booking/:userId", (req, res) => {
  res.status(200).send(req.params);
});
// define the route for an user to make an appointment
router.post("/booking/:userId/:coachId", (req, res) => {
  res.status(200).send(req.params);
});

module.exports = router;
