const express = require("express")
const router = express.Router()
const Deck = require("../models/Deck")

/* GET home page - all decks. */
router.get("/", async (req, res) => {
  const { name, author, format, w, u, b, r, g, c, and } = req.query
  console.log(req.query)
  const nameRegex = new RegExp(`${name}`, "i")
  const authorRegex = new RegExp(`${author}`, "i")

  const queryObj = (name, author, format, w, u, b, r, g, c, and) => {
    let object = {}
    let colorsArr = [w, u, b, r, g, c]
    if (name) {
      object["name"] = nameRegex
    }
    if (author) {
      object["authorUsername"] = authorRegex
    }
    if (format) {
      object["format"] = format
    }
    let colorsSearchArr = []
    for (let color of colorsArr) {
      if (color !== "none") {
        colorsSearchArr.push({ [color]: true })
      }
    }
    if (colorsSearchArr.length > 0) {
      and === "and"
        ? (object.colors = { $all: [...colorsSearchArr] })
        : (object.colors = { $in: [...colorsSearchArr] })
    }

    return object
  }

  try {
    const decks = await Deck.find(
      queryObj(name, author, format, w, u, b, r, g, c, and)
    ).sort({
      date: -1
    })
    res.json(decks)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
