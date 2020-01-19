const mongoose = require("mongoose")
const Schema = mongoose.Schema

const DeckSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  format: {
    type: String,
    required: true
  },
  mainboard: {
    type: Array,
    required: true
  },
  sideboard: {
    type: Array
  },
  /* commander: {
    type: String
  },*/
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  authorUsername: {
    type: String
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Deck", DeckSchema)
