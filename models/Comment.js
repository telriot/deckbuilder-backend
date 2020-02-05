const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  text: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  deck: {
    type: Schema.Types.ObjectId,
    ref: "Deck"
  }
})

module.exports = mongoose.model("Comment", CommentSchema)
