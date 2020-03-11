const express = require("express")
const router = express.Router()
const Deck = require("../models/Deck")

/* GET home page - all decks. */
router.get("/", async (req, res) => {
  const {
    name,
    author,
    format,
    w,
    u,
    b,
    r,
    g,
    c,
    and,
    activity,
    sortOrder,
    page
  } = req.query
  const nameRegex = new RegExp(`${name}`, "i")
  const authorRegex = new RegExp(`${author}`, "i")

  const queryObj = (name, author, format, w, u, b, r, g, c, and, activity) => {
    let object = {}
    const setActivityDate = activity => {
      let date = new Date()
      date.setDate(date.getDate() - parseInt(activity))
      console.log(date)
      return date
    }

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
    if (activity) {
      console.log(activity)
      object["updated_at"] = { $gte: setActivityDate(activity) }
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
    const decks = await Deck.paginate(
      queryObj(name, author, format, w, u, b, r, g, c, and, activity),
      {
        sort: { [sortOrder]: -1 },
        page: page || 1,
        limit: 12
      }
    )
    res.json(decks)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
