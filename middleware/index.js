const Deck = require("../models/Deck")
const Comment = require("../models/Comment")
const User = require("../models/User")
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
  }
}
