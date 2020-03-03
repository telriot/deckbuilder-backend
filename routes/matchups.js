const express = require("express")
const router = express.Router()
const Deck = require("../models/Deck")
const Match = require("../models/Match")
const { isLoggedIn } = require("../middleware")

/*GET an individual match by its ID */
router.get("/:id", async (req, res, next) => {
  try {
    let match = await Match.findById({ _id: req.params.id })
    res.send(match)
  } catch (error) {
    console.error(error.message)
  }
})

/*GET /decks/:id/matchups using Deck ID */
router.get("/", async (req, res, next) => {
  try {
    var regex = new RegExp(`${req.query.matchupDeck}`, "i")
    let matches = await Match.paginate(
      {
        deck: req.query.deckId,
        archetype: req.query.archetype
          ? req.query.archetype
          : { $exists: true },
        matchupDeck: req.query.matchupDeck ? regex : { $exists: true }
      },
      { sort: { date: -1 }, page: req.query.page || 1, limit: 10 }
    )
    res.send(matches)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

/*POST /decks/:id/matchups CREATE Matchup record */

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const { matchupDeck, comment, result, deckId, archetype } = req.body
    let deck = await Deck.findOne({ _id: deckId })
      .populate("matches")
      .exec()
    let match = await Match.create({
      archetype,
      matchupDeck,
      comment,
      author: req.user._id,
      result: { g1: result.g1, g2: result.g2, g3: result.g3 },
      deck
    })
    await deck.matches.push(match)
    await deck.save()
    res.json("matchup successfully posted")
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Server Error")
  }
})

/* PUT /:id/matchups Update a deck's matchup sheet*/
router.put("/", isLoggedIn, async (req, res, next) => {
  const { matchup, deckId } = req.body

  try {
    const archetype = matchup.archetype.toLowerCase()
    const preboard = `matchups.${archetype}.preboard`
    const postboard = `matchups.${archetype}.postboard`
    const total = `matchups.${archetype}.total`
    const deck = await Deck.findOne({ _id: deckId })

    await Deck.updateOne(
      { _id: deckId },
      {
        $set: {
          [preboard]: {
            w:
              deck.matchups[archetype].preboard.w + matchup.preboard.w
                ? deck.matchups[archetype].preboard.w + matchup.preboard.w
                : 0,
            l:
              deck.matchups[archetype].preboard.l + matchup.preboard.l
                ? deck.matchups[archetype].preboard.l + matchup.preboard.l
                : 0,
            u:
              deck.matchups[archetype].preboard.u + matchup.preboard.u
                ? deck.matchups[archetype].preboard.u + matchup.preboard.u
                : 0
          },
          [postboard]: {
            w:
              deck.matchups[archetype].postboard.w + matchup.postboard.w
                ? deck.matchups[archetype].postboard.w + matchup.postboard.w
                : 0,
            l:
              deck.matchups[archetype].postboard.l + matchup.postboard.l
                ? deck.matchups[archetype].postboard.l + matchup.postboard.l
                : 0,
            u:
              deck.matchups[archetype].postboard.u + matchup.postboard.u
                ? deck.matchups[archetype].postboard.u + matchup.postboard.u
                : 0
          },
          [total]: {
            w:
              deck.matchups[archetype].total.w + matchup.total.w
                ? deck.matchups[archetype].total.w + matchup.total.w
                : 0,
            l:
              deck.matchups[archetype].total.l + matchup.total.l
                ? deck.matchups[archetype].total.l + matchup.total.l
                : 0,
            u:
              deck.matchups[archetype].total.u + matchup.total.u
                ? deck.matchups[archetype].total.u + matchup.total.u
                : 0
          }
        }
      }
    )
  } catch (error) {
    console.log(error)
    res.status(500).send("Server Error")
  }
  res.json("matchup successfully posted")
})

/*POST /decks/:id/Matchups/:Matchup_id Destroy Matchup */

router.post("/:id", async (req, res, next) => {
  try {
    const { deckId, matchId } = req.body

    const deck = await Deck.findOne({ _id: deckId })
    await deck.matches.pull(matchId)
    await deck.save()
    await Match.findOneAndDelete({ _id: matchId })
    res.send("removed")
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

module.exports = router
