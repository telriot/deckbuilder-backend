const express = require("express")
const router = express.Router()
const Deck = require("../models/Deck")
const Comment = require("../models/Comment")
const { isLoggedIn, isCommentAuthor } = require("../middleware")

/*GET /decks/:id/comments using Deck ID */
router.get("/", async function(req, res, next) {
  try {
    let comments = await Comment.paginate(
      { deck: req.query.deckId },
      { sort: { date: -1 }, page: req.query.page || 1, limit: 10 }
    )
    res.send(comments)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

/*POST /decks/:id/comments CREATE comment */
router.post("/", isLoggedIn, async function(req, res, next) {
  try {
    let deck = await Deck.findOne({ _id: req.body.deckId })
      .populate("comments")
      .exec()
    let comment = await Comment.create({
      text: req.body.text,
      author: req.user._id,
      authorUsername: req.body.authorUsername,
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

/*PUT /decks/:id/comments/:comment_id Edit comment */
router.put("/:comment_id", isCommentAuthor, async function(req, res, next) {
  try {
    const { commentId, text } = req.body
    await Comment.findOneAndUpdate({ _id: commentId }, { text: text })
    res.send("Comment successfully updated")
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Server Error")
  }
})

/*POST /decks/:id/comments/:comment_id/destroy Destroy Comment */
router.post("/:comment_id", isCommentAuthor, async function(req, res, next) {
  try {
    const { deckId, commentId } = req.body
    const deck = await Deck.findOne({ _id: deckId })
    await deck.comments.pull(commentId)
    await deck.save()
    await Comment.findOneAndDelete({ _id: commentId })
    res.send("removed")
  } catch (error) {
    console.log(error)
    res.status(500).send("Server Error")
  }
})

module.exports = router
