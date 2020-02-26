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
const usersRouter = require("./routes/users")
const authRouter = require("./routes/auth")
const decksRouter = require("./routes/decks")
const commentsRouter = require("./routes/comments")
const matchupsRouter = require("./routes/matchups")

const app = express()

// Connect to the db, fix deprecations
mongoose.connect("mongodb://localhost:27017/deckbuilder", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function() {
  console.log("DB Connected")
})
mongoose.set("useFindAndModify", false)
mongoose.set("useCreateIndex", true)

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
app.use("/api/users", usersRouter)
app.use("/api/auth", authRouter)
app.use("/api/decks", decksRouter)
app.use("/api/decks/:id/comments", commentsRouter)
app.use("/api/decks/:id/matchups", matchupsRouter)

module.exports = app