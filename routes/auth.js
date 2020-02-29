const express = require("express")
const router = express.Router()
const User = require("../models/User")
const passport = require("passport")
const { body, check, validationResult } = require("express-validator")
const { userValidationRules, validate } = require("../middleware")

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
  userValidationRules(),
  validate,
  async (req, res, next) => {
    const { password, username, email } = req.body
    try {
      await User.findOne({ username }, (err, user) => {
        if (err) {
        } else if (user) {
          console.log("username already in use")
          res.json({
            error: `The username '${username}' is already in use`
          })
        } else {
          //Save user to the DB
          const newUser = new User({
            username: username,
            password: password,
            email: email
          })
          newUser.save((err, savedUser) => {
            if (err) {
              console.log(err)
              return res.json(err)
            } else {
              res.json(savedUser)
            }
          })
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
    console.log("no user to log out")
  }
})

module.exports = router
