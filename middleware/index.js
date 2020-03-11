const Deck = require("../models/Deck")
const Comment = require("../models/Comment")
const User = require("../models/User")
const { body, validationResult } = require("express-validator")

module.exports = {
  asyncErrorHandler: fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  },

  isLoggedIn: async (req, res, next) => {
    if (req.user._id) {
      return next()
    }
    res.json("Unauthorized action")
    console.log("Database interaction attempt from non-authenticated user")
  },

  isDeckAuthor: async (req, res, next) => {
    let deck = await Deck.findById(req.params.id)
    if (deck.author.equals(req.user._id)) {
      return next()
    }
    res.json("Unauthorized attempt")
    console.log("Attempt to edit deck from unauthorized user")
  },

  isCommentAuthor: async (req, res, next) => {
    let comment = await Comment.findById(req.params.comment_id)
    if (comment.author.equals(req.user._id)) {
      return next()
    }
    res.json("Unauthorized attempt")
    console.log("Attempt to edit comment from unauthorized user")
  },

  isProfileOwner: async (req, res, next) => {
    let user = await User.findById(req.params.id)
    if (user.equals(req.user._id)) {
      return next()
    }
    res.json("Unauthorized attempt")
    console.log("Attempt to edit profile from unauthorized user")
  },

  userValidationRules: () => {
    return [
      body("username").custom(value => {
        const usr = /^[A-Za-z]\w{4,14}$/
        if (!value.match(usr)) {
          throw new Error("Username is not valid")
        } else {
          return true
        }
      }),
      body("email").custom(value => {
        const emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!value.match(emailregex)) {
          throw new Error("Not a valid email address")
        } else {
          return true
        }
      }),
      body("passwordConfirmation").custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password")
        } else {
          return true
        }
      }),
      body("password").custom(value => {
        const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
        if (!value.match(passw)) {
          throw new Error("Password is not valid")
        } else {
          return true
        }
      })
    ]
  },

  editProfileValidationRules: () => {
    return [
      body("user.email").custom(value => {
        const emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!value.match(emailregex)) {
          throw new Error("Not a valid email address")
        } else {
          return true
        }
      }),
      body("user.dciNumber")
        .isLength({ max: 10 })
        .custom(value => {
          const dciRegex = /^\d+$/
          if (!value.match(dciRegex)) {
            throw new Error("Not a valid DCI number")
          } else {
            return true
          }
        }),
      body("user.mtgoUsername")
        .isString()
        .isLength({ max: 20 })
        .withMessage("Not a valid MTGO Username"),
      body("user.arenaUsername")
        .isString()
        .isLength({ max: 20 })
        .withMessage("Not a valid Arena Username"),
      body("user.country").isString(),
      body("user.city").isString(),
      body("user.description")
        .isString()
        .isLength({ max: 500 })
        .withMessage("Please keep your description within 500 characters")
    ]
  },

  resetPasswordValidationRules: () => {
    return [
      body("email").custom(value => {
        const emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!value.match(emailregex)) {
          throw new Error("Not a valid email address")
        } else {
          return true
        }
      })
    ]
  },

  validate: (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
    console.log(extractedErrors)
    return res.status(422).json({
      errors: extractedErrors
    })
  }
}
