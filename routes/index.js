const express = require("express")
const router = express.Router()
const Deck = require("../models/Deck")

/* GET home page - all decks. */
router.get("/", async (req, res) => {
  try {
    const decks = await Deck.find().sort({ date: -1 })
    res.json(decks)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
