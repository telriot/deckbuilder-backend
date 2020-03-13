const express = require("express")
const router = express.Router()
const Card = require("../models/Card")

/*GET api/cards get cards according to params */
router.get("/", async function(req, res, next) {
  const name = req.query.name && new RegExp(`${req.query.name}`, "i")
  const type = req.query.type && new RegExp(`${req.query.type}`, "i")
  const { cmc, rarity, color, page, direction, orderCriteria } = req.query

  let queryObj = {}
  if (name) {
    queryObj.name = name
  }
  if (cmc) {
    queryObj.cmc = cmc
  }
  if (rarity) {
    queryObj.rarity = rarity
  }
  if (type) {
    queryObj.type_line = type
  }
  if (color) {
    if (color === "m") {
      queryObj = { ...queryObj, "colors.1": { $exists: true } }
    } else if (color === "c") {
      queryObj.colors = { $size: 0 }
    } else {
      queryObj.colors = { $in: [color.toUpperCase()] }
    }
  }
  try {
    let cards = await Card.paginate(queryObj, {
      sort: { [orderCriteria]: direction === "asc" ? 1 : -1 },
      page: page || 1,
      limit: 50
    })
    res.send(cards)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

/*GET api/cards/:id get individual cards */
router.get("/singlecard/", async function(req, res, next) {
  const nameRegex = req.query.name && new RegExp(`${req.query.name}`, "i")
  try {
    let card = await Card.findOne({ name: req.query.name })
    if (!card) {
      card = await Card.findOne({ name: nameRegex })
    }
    res.json(card)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

module.exports = router
