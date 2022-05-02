const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const ErrorHandler = require('../tools/errorHandler')

const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Please enter username!'],
      minlength: [5, 'Username should have more than 5 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email address'],
      unique: true,
      validate: [validator.isEmail, 'Invalid email address'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter password'],
      select: false,
      minlength: [8, 'Password should have more than 8 characters'],
      validate: [validator.isStrongPassword, 'To weak password'],
    },
    profilePicture: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const user = await mongoose
    .model('User', userSchema)
    .findOne({ $or: [{ email: this.email }, { username: this.username }] })

  if (user) {
    if (this.username === user.username)
      next(new ErrorHandler('This username is already taken', 500))
    if (this.email === user.email)
      next(new ErrorHandler('This email address is already taken', 500))
  }

  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.SALT_ROUNDS)
  )
})

module.exports = mongoose.model('User', userSchema)