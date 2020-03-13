const express = require("express")
const router = express.Router()
const Deck = require("../models/Deck")
const SideGuide = require("../models/SideGuide")
const { isLoggedIn } = require("../middleware")

/*GET an individual sideguide by its ID */
router.get("/:id", async (req, res, next) => {
  try {
    let sideGuide = await SideGuide.findById({ _id: req.params.id })
    res.json(sideGuide)
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Server Error")
  }
})
/*GET /decks/:id/sideguides using Deck ID */
router.get("/", async (req, res, next) => {
  try {
    let sideGuides = await SideGuide.paginate(
      { deck: req.query.deckId },
      { sort: { matchup: "asc" }, page: req.query.page || 1, limit: 18 }
    )
    res.json(sideGuides)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})
/*POST /decks/:id/sideguides CREATE sideguide record */
router.post("/", async (req, res, next) => {
  try {
    const { matchup, sideIn, sideOut, comments, deckId } = req.body
    let deck = await Deck.findOne({ _id: deckId })
      .populate("sideGuides")
      .exec()
    const sideGuide = await SideGuide.create({
      matchup,
      sideIn,
      sideOut,
      comments,
      author: req.user._id,
      deck
    })
    await deck.sideGuides.push(sideGuide)
    await deck.save()
    res.json("sideguide successfully posted")
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Server Error")
  }
})

/* PUT /:id/sideguides/:sideguide_id Update a sideguide*/
router.put("/:id", async (req, res, next) => {
  try {
    const { matchup, sideIn, sideOut, comments } = req.body
    await SideGuide.findOneAndUpdate(
      { _id: req.params.id },
      {
        matchup,
        sideIn,
        sideOut,
        comments
      }
    )
    res.json("sideguide successfully edited")
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Server Error")
  }
})

/*POST /decks/:id/sideguides/:sideguide_id Destroy sideguide */
router.post("/:id", async (req, res, next) => {
  try {
    const { deckId, sideGuideId } = req.body
    const deck = await Deck.findOne({ _id: deckId })
    await deck.sideGuides.pull(sideGuideId)
    await deck.save()
    await SideGuide.findOneAndDelete({ _id: sideGuideId })
    res.send("removed")
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

module.exports = router
