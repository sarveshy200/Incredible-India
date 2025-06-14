const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

router.get("/", (req, res) => {
  res.redirect("/listings"); // or res.render("home");
});


router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.registerUser))

router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginUser
)

// Logout User
router.get("/logout", userController.logoutUser);

module.exports = router;
