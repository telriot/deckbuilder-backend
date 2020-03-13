const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const Schema = mongoose.Schema

const SideGuideSchema = new Schema({
  matchup: String,
  sideIn: String,
  sideOut: String,
  comments: String,
  deck: {
    type: Schema.Types.ObjectId,
    ref: "Deck"
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: Date,
    default: Date.now
  }
})

SideGuideSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("SideGuide", SideGuideSchema)
