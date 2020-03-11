const crypto = require("crypto")
const express = require("express")
const router = express.Router()
const User = require("../models/User")
const passport = require("passport")
const {
  resetPasswordValidationRules,
  userValidationRules,
  validate
} = require("../middleware")
const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs")
const BCRYPT_SALT_ROUNDS = 10

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

/* POST forgotten password reset request */
router.post(
  "/forgotPassword",
  resetPasswordValidationRules(),
  validate,
  async (req, res) => {
    try {
      const token = await crypto.randomBytes(20).toString("hex")
      const user = await User.findOneAndUpdate(
        { email: req.body.email },
        {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000
        }
      )
      if (!user) {
        console.error("email not in database")
        res.status(403).send("email not in db")
      } else {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`
          }
        })
        const mailOptions = {
          from: "decklog@gmail.com",
          to: `${user.email}`,
          subject: "Link To Reset Password",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it : \n\n" +
            `http://localhost:3000/reset/${token}\n\n` +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
        }
        console.log("sending email")
        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error("there was an error", err)
          } else {
            console.log("here is the res:", response)
            res.status(200).json("recovery email sent")
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
)

/*GET password reset page */
router.get("/reset", async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.query.resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    })
    if (!user) {
      console.log("password reset link is invalid or has expired")
      res.json("password reset link is invalid or has expired")
    } else {
      res.status(200).send({
        username: user.username,
        message: "password reset link a-ok"
      })
    }
  } catch (error) {
    console.log(error)
  }
})

/*PUT update password via email */
router.put("/updatePasswordViaEmail", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      BCRYPT_SALT_ROUNDS
    )
    await User.findOneAndUpdate(
      { username: req.body.username },
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    )
    console.log("user exists in db")
    console.log("password updated")
    res.status(200).send({ message: "password updated" })
  } catch (error) {
    console.log("no user exists in db to update")
    res.status(404).json("no user exists in db to update")
  }
})
module.exports = router
