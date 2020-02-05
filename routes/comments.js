const express = require("express")
const router = express.Router()
const Deck = require("../models/Deck")
const Comment = require("../models/Comment")
const { isLoggedIn, isCommentAuthor } = require("../middleware")

/*POST /decks/:id/comments CREATE comment */
router.post("/", isLoggedIn, async function(req, res, next) {
  try {
    let deck = await Deck.findOne({ _id: req.body.deckId })
      .populate("comments")
      .exec()
    let comment = await Comment.create({
      text: req.body.text,
      author: req.user._id,
      deck: deck
    })
    await deck.comments.push(comment)
    await deck.save()
    res.json("comment successfully posted")
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Server Error")
  }
})

/*POST /decks/:id/comments/:comment_id Destroy comment */
router.post("/:comment_id", isCommentAuthor, async function(req, res, next) {
  try {
    const { deckId, commentId } = req.body
    let deck = await Deck.findOneAndUpdate(
      { _id: deckId },
      { $pull: { comments: { _id: commentId } } }
    )
    console.log(deck.name, "deck")
    await Comment.findOneAndDelete({ _id: commentId })
    res.send("removed")
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
