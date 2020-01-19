const express = require("express")
const router = express.Router()
const Deck = require("../models/Deck")

/* GET /:id get a deck by ID */
router.get("/:id", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id)
      .populate({
        path: "comments",
        options: { sort: { _id: -1 } },
        populate: {
          path: "author",
          model: "User",
          select: "-password"
        }
      })
      .exec()
    res.json(deck)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

/* POST / Post a deck */
router.post("/", function(req, res, next) {
  // Validation
  const { name, format, mainboard, sideboard, authorUsername } = req.body
  const author = req.user._id
  Deck.findOne({ author: author, name: name }, (err, deck) => {
    if (err) {
      console.log(err)
    } else if (deck) {
      console.log({
        error: `You already have a deck by this name`
      })
    } else {
      const newDeck = new Deck({
        name,
        format,
        mainboard,
        sideboard,
        authorUsername
      })
      newDeck.save((err, savedDeck) => {
        if (err) return res.json(err)
        res.json(savedDeck)
      })
    }
  })
})

/* PUT /:id Update a deck */
router.put("/:id", async function(req, res, next) {
  const { name, format, mainboard, sideboard } = req.body
  try {
    await Deck.findOneAndUpdate(
      { _id: req.params.id },
      { name, format, mainboard, sideboard }
    )
  } catch (error) {
    console.log(error)
  }
  res.json("update successful")
})

/* DELETE /:id Destroy a deck */
router.delete("/:id", async function(req, res, next) {
  try {
    console.log(req.params.id)
    await Deck.findOneAndDelete({ _id: req.params.id })
    res.json("deck successfully removed")
  } catch (error) {
    console.log(error)
  }
})
module.exports = router
