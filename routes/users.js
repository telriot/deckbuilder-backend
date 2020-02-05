const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Deck = require("../models/Deck")
const { isProfileOwner } = require("../middleware")

/* GET /:id user by Id . */
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(500).send("Server Error")
  }
})

router.get("/:id/decks", async (req, res, next) => {
  try {
    const decks = await Deck.find({ author: req.params.id })
    res.json(decks)
  } catch (error) {
    console.log(error)
    res.status(500).send("Server Error")
  }
})

/* PUT /:id update user profile */
router.put("/:id", isProfileOwner, async (req, res, next) => {
  const { description } = req.body
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      description
    })
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(500).send("Server Error")
  }
})

module.exports = router
