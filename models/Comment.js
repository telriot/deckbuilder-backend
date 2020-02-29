const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  text: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  authorUsername: String,
  deck: {
    type: Schema.Types.ObjectId,
    ref: "Deck"
  },
  date: {
    type: Date,
    default: Date.now
  }
})

CommentSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("Comment", CommentSchema)
