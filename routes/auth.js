const express = require("express")
const router = express.Router()
const User = require("../models/User")
const passport = require("passport")
const { body, check, validationResult } = require("express-validator")

/* GET /  user? request */
router.get("/", (req, res, next) => {
  if (req.user) {
    res.json({
      user: req.user,
      username: req.session.passport.user.username,
      id: req.session.passport.user._id
    })
  } else {
    res.json({ user: null })
  }
})

/* POST signup request */
router.post(
  "/signup",
  // Validators
  [
    body("passwordConfirmation").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password")
      }
      console.log("confirmationvalidation")

      return true
    }),
    body("password").custom(value => {
      let passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
      if (!value.match(passw)) {
        throw new Error("Password is not valid")
      }
      console.log("passvalidation")

      return true
    }),
    body("username").custom(value => {
      let usr = /^[A-Za-z]\w{4,14}$/
      if (!value.match(usr)) {
        throw new Error("Username is not valid")
      }
      console.log("uservalidation")
      return true
    })
  ],
  async (req, res, next) => {
    //User in DB validation
    const { password, username } = req.body
    try {
      await User.findOne({ username }, (err, user) => {
        if (err) {
        } else if (user) {
          res.json({
            error: `The username '${username}' is already in use`
          })
        } else {
          //Save user to the DB
          const newUser = new User({
            username: username,
            password: password
          })
          newUser.save((err, savedUser) => {
            if (err) return res.json(err)
            res.json(savedUser)
          })
          console.log("newUser saved")
        }
      })
    } catch (error) {
      console.log(error)
      res.status(500).send("Server Error")
    }
  }
)

/* POST login request */
router.post("/login", passport.authenticate("local"), (req, res) => {
  var userInfo = {
    email: req.user.email,
    username: req.user.username,
    id: req.user._id
  }
  res.json(userInfo)
})

/* POST logout request */

router.post("/logout", (req, res) => {
  if (req.user) {
    req.logout()
    console.log("logging out")
    res.send({ msg: "logging out" })
  } else {
    res.send({ msg: "no user to log out" })
    console.log("no user for logging out")
  }
})

module.exports = router
