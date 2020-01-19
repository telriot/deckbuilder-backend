const express = require("express")
const router = express.Router()
const User = require("../models/User")
const passport = require("passport")

/* GET /  user? request */
router.get("/", (req, res, next) => {
  if (req.user) {
    res.json({ user: req.user, email: req.session.passport.user.username })
  } else {
    res.json({ user: null })
  }
})

/* POST signup request */
router.post("/signup", function(req, res, next) {
  // Validation
  const { email, password, username } = req.body
  User.findOne({ email }, (err, user) => {
    if (err) {
    } else if (user) {
      res.json({
        error: `The email address '${email}' is already in use`
      })
    } else {
      //Save user to the DB
      const newUser = new User({
        username: username,
        email: email,
        password: password
      })
      newUser.save((err, savedUser) => {
        if (err) return res.json(err)
        res.json(savedUser)
      })
    }
  })
})

/* POST login request */
router.post("/login", passport.authenticate("local"), (req, res) => {
  var userInfo = {
    email: req.user.email,
    username: req.user.username
  }
  res.json(userInfo)
})

/* POST logout request */

router.post("/logout", (req, res) => {
  if (req.user) {
    req.logout()
    res.send({ msg: "logging out" })
  } else {
    res.send({ msg: "no user to log out" })
  }
})

module.exports = router
