const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")

mongoose.promise = Promise

// Define userSchema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dciNumber: String,
  arenaUsername: String,
  mtgoUsername: String,
  country: String,
  city: String,
  date: {
    type: Date,
    default: Date.now
  },
  description: String
})

UserSchema.methods = {
  checkPassword: function(inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password)
  },
  hashPassword: plainTextPassword => {
    return bcrypt.hashSync(plainTextPassword, 10)
  }
}

// Define hooks for pre-saving
UserSchema.pre("save", function(next) {
  this.password = this.hashPassword(this.password)
  next()
})

const User = mongoose.model("User", UserSchema)
module.exports = User
