require("dotenv").config()
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const passport = require("./passport")
const indexRouter = require("./routes/index")
const cardsRouter = require("./routes/cards")
const usersRouter = require("./routes/users")
const authRouter = require("./routes/auth")
const decksRouter = require("./routes/decks")
const commentsRouter = require("./routes/comments")
const matchupsRouter = require("./routes/matchups")
const sideguidesRouter = require("./routes/sideguides")
const cors = require("cors")

/*const Card = require("./models/Card")
const cardData = require("/home/benjo/CODE/deckbuilder/backend/cardData/scryfall-default-cards.json")*/

const app = express()
app.use(cors())
// Connect to the db, fix deprecations
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/deckbuilder",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function() {
  console.log("DB Connected")
})
mongoose.set("useFindAndModify", false)
mongoose.set("useCreateIndex", true)

/*Load cards collection
Card.insertMany(cardData, function(error, docs) {
  if (error) {
    console.log(error)
  }
})*/

// Setup public assets directory
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET, //pick a random string to make the hash that is generated secure
    resave: false, //required
    saveUninitialized: false, //required
    store: new MongoStore({ mongooseConnection: db })
  })
)

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Mount Routes
app.use("/api/", indexRouter)
app.use("/api/cards", cardsRouter)
app.use("/api/users", usersRouter)
app.use("/api/auth", authRouter)
app.use("/api/decks", decksRouter)
app.use("/api/decks/:id/comments", commentsRouter)
app.use("/api/decks/:id/matchups", matchupsRouter)
app.use("/api/decks/:id/sideguides", sideguidesRouter)

module.exports = app
