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
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Comment", CommentSchema)
