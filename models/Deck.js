const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const Schema = mongoose.Schema

const DeckSchema = new Schema(
  {
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
    colors: { type: Array },
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
    },
    matchups: {
      aggro: {
        archetype: String,
        preboard: Object,
        postboard: Object,
        total: Object
      },
      disruptive: {
        archetype: String,
        preboard: Object,
        postboard: Object,
        total: Object
      },
      midrange: {
        archetype: String,
        preboard: Object,
        postboard: Object,
        total: Object
      },
      combo: {
        archetype: String,
        preboard: Object,
        postboard: Object,
        total: Object
      },
      combocontrol: {
        archetype: String,
        preboard: Object,
        postboard: Object,
        total: Object
      },
      control: {
        archetype: String,
        preboard: Object,
        postboard: Object,
        total: Object
      },
      ramp: {
        archetype: String,
        preboard: Object,
        postboard: Object,
        total: Object
      },
      others: {
        archetype: String,
        preboard: Object,
        postboard: Object,
        total: Object
      }
    },
    matches: [
      {
        type: Schema.Types.ObjectId,
        ref: "Match"
      }
    ],
    sideGuides: [{ type: Schema.Types.ObjectId, ref: "SideGuide" }]
  },
  { timestamps: { updatedAt: "updated_at" } }
)

DeckSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Deck", DeckSchema)
