const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const Schema = mongoose.Schema

const MatchSchema = new Schema({
  archetype: String,
  matchupDeck: String,
  comment: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  result: {
    g1: String,
    g2: String,
    g3: String
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

MatchSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("Match", MatchSchema)
