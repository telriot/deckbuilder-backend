const express = require("express")
const router = express.Router()
const Deck = require("../models/Deck")
const User = require("../models/User")
const Comment = require("../models/Comment")
const Match = require("../models/Match")
const { check, validationResult } = require("express-validator")
const { isLoggedIn, isDeckAuthor } = require("../middleware")

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
      .populate({
        path: "matches",
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
router.post(
  "/",
  isLoggedIn,
  [
    check("name")
      .isLength({ min: 1 })
      .trim(),
    check("format").isLength({ min: 1 }),
    check("mainboard").isLength({ min: 1 })
  ],
  async function(req, res, next) {
    // Validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const { name, format, mainboard, sideboard, colors } = req.body
    try {
      const author = await User.findById(req.user._id)
      console.log(author)
      await Deck.findOne({ author: author, name: name }, (err, deck) => {
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
            author,
            colors,
            authorUsername: author.username,
            matchups: {
              aggro: {
                archetype: "Aggro",
                preboard: { w: 0, l: 0, u: 0 },
                postboard: { w: 0, l: 0, u: 0 },
                total: { w: 0, l: 0, u: 0 }
              },
              disruptive: {
                archetype: "Disruptive",
                preboard: { w: 0, l: 0, u: 0 },
                postboard: { w: 0, l: 0, u: 0 },
                total: { w: 0, l: 0, u: 0 }
              },
              midrange: {
                archetype: "Midrange",
                preboard: { w: 0, l: 0, u: 0 },
                postboard: { w: 0, l: 0, u: 0 },
                total: { w: 0, l: 0, u: 0 }
              },
              combo: {
                archetype: "Combo",
                preboard: { w: 0, l: 0, u: 0 },
                postboard: { w: 0, l: 0, u: 0 },
                total: { w: 0, l: 0, u: 0 }
              },
              combocontrol: {
                archetype: "Combo-control",
                preboard: { w: 0, l: 0, u: 0 },
                postboard: { w: 0, l: 0, u: 0 },
                total: { w: 0, l: 0, u: 0 }
              },
              control: {
                archetype: "Control",
                preboard: { w: 0, l: 0, u: 0 },
                postboard: { w: 0, l: 0, u: 0 },
                total: { w: 0, l: 0, u: 0 }
              },
              ramp: {
                archetype: "Ramp",
                preboard: { w: 0, l: 0, u: 0 },
                postboard: { w: 0, l: 0, u: 0 },
                total: { w: 0, l: 0, u: 0 }
              },
              others: {
                archetype: "Others",
                preboard: { w: 0, l: 0, u: 0 },
                postboard: { w: 0, l: 0, u: 0 },
                total: { w: 0, l: 0, u: 0 }
              }
            },
            matches: []
          })
          console.log(newDeck)
          newDeck.save((err, savedDeck) => {
            if (err) return res.json(err)
            res.json(savedDeck)
          })
        }
      })
    } catch (error) {
      console.log(error)
      res.status(500).send("Server Error")
    }
  }
)

/* PUT /:id Update a deck */
router.put(
  "/:id",
  isDeckAuthor,
  [
    check("name")
      .isLength({ min: 1 })
      .trim(),
    check("format").isLength({ min: 1 }),
    check("mainboard").isLength({ min: 1 })
  ],
  async function(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const { name, format, mainboard, sideboard, colors } = req.body
    try {
      await Deck.findOneAndUpdate(
        { _id: req.params.id },
        { name, format, mainboard, sideboard, colors }
      )
    } catch (error) {
      console.log(error)
      res.status(500).send("Server Error")
    }
    res.json("update successful")
  }
)

/* DELETE /:id Destroy a deck */
router.delete("/:id", isDeckAuthor, async function(req, res, next) {
  try {
    await Deck.findOneAndDelete({ _id: req.params.id })
    res.json("deck successfully removed")
    await Comment.deleteMany({ deck: req.params.id })
    res.json("comments successfully removed")
    await Match.deleteMany({ deck: req.params.id })
    res.json("matches successfully removed")
  } catch (error) {
    console.log(error)
    res.status(500).send("Server Error")
  }
})
module.exports = router
