const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/", (req, res) => {
  res.redirect("/listings");
});
router
      .route("/signup")
      .get(userController.renderSignup)   
      .post(wrapAsync(userController.signup));


router
      .route("/login")
      .get(wrapAsync(userController.renderLogin))
      .post(
      saveRedirectUrl,
       passport.authenticate("local",{
        failureRedirect : '/login',
        failureFlash : true
        }),
        wrapAsync(userController.login));


router.get("/logout",userController.logout);


module.exports = router;