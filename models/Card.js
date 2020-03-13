const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const Schema = mongoose.Schema

const CardSchema = new Schema({
  object: String,
  id: String,
  oracle_id: String,
  multiverse_ids: [],
  mtgo_id: Number,
  arena_id: Number,
  tcgplayer_id: Number,
  name: String,
  lang: String,
  released_at: String,
  uri: String,
  scryfall_uri: String,
  layout: String,
  highres_image: Boolean,
  image_uris: {
    small: String,
    normal: String,
    large: String,
    png: String,
    art_crop: String,
    border_crop: String
  },
  mana_cost: String,
  cmc: Number,
  type_line: String,
  oracle_text: String,
  power: String,
  toughness: String,
  colors: [],
  color_identity: [],
  all_parts: [],
  legalities: {},
  games: [],
  reserved: Boolean,
  foil: Boolean,
  nonfoil: Boolean,
  oversized: Boolean,
  promo: Boolean,
  reprint: Boolean,
  variation: Boolean,
  set: String,
  set_name: String,
  set_type: String,
  set_uri: String,
  set_search_uri: String,
  scryfall_set_uri: String,
  rulings_uri: String,
  prints_search_uri: String,
  collector_number: String,
  digital: Boolean,
  rarity: String,
  flavor_text: String,
  card_back_id: String,
  artist: String,
  artist_ids: [],
  illustration_id: String,
  border_color: String,
  frame: String,
  full_art: Boolean,
  textless: Boolean,
  booster: Boolean,
  story_spotlight: Boolean,
  edhrec_rank: Number,
  prices: {
    usd: Number,
    usd_foil: Number,
    eur: Number,
    tix: Number
  },
  related_uris: {
    gatherer: String,
    tcgplayer_decks: String,
    edhrec: String,
    mtgtop8: String
  },
  purchase_uris: {
    tcgplayer: String,
    cardmarket: String,
    cardhoarder: String
  }
})

CardSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("Card", CardSchema)
