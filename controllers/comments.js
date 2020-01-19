const Deck = require("../models/Deck")
const Comment = require("../models/Comment")

module.exports = {
  async commentCreate(req, res, next) {
    let deck = await Deck.findOne(req.params.id)
    let comment = await Comment.create({
      text: req.body.text,
      author: req.user._id
    })
    console.log(comment, "comments", deck.comments)
    await deck.comments.push(comment)
    deck.save()
    res.json("comment successfully posted")
  }
}
