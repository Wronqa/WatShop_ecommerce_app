const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const ErrorHandler = require('../tools/errorHandler')
const crypto = require('crypto-js')
const { nanoid } = require('nanoid')
const jwt = require('jsonwebtoken')

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
    role: {
      type: String,
      default: 'user',
    },
    accountStatus: {
      activeStatus: {
        type: Boolean,
        default: false,
      },
      activationToken: {
        type: String,
      },
      activationTokenExpire: {
        type: Date,
      },
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpire: {
      type: Date,
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  if (this.isModified('username') || this.isModified('email')) {
    const user = await mongoose
      .model('User', userSchema)
      .findOne({ $or: [{ email: this.email }, { username: this.username }] })

    if (user) {
      if (this.username === user.username)
        next(new ErrorHandler('This username is already taken', 500))
      if (this.email === user.email)
        next(new ErrorHandler('This email address is already taken', 500))
    }
  }

  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.SALT_ROUNDS)
  )
})
userSchema.pre('findOneAndUpdate', async function (next) {
  const user = await mongoose
    .model('User', userSchema)
    .findOne({ email: this._update.email })

  if (user) {
    if (this._update.email === user.email)
      next(new ErrorHandler('This email address is already taken', 500))
  }
})

userSchema.methods.generateActivationToken = function () {
  const token = nanoid(20)

  this.accountStatus.activationToken = crypto
    .SHA256(token)
    .toString(crypto.enc.Hex)
  this.accountStatus.activationTokenExpire = Date.now() + 60 * 60 * 1000

  return token
}
userSchema.methods.generateResetPasswordToken = function () {
  const token = nanoid(20)

  this.resetPasswordToken = crypto.SHA256(token).toString(crypto.enc.Hex)

  this.accountStatus.activationTokenExpire = Date.now() + 60 * 60 * 1000

  return token
}

userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.getJWTTokens = function () {
  return {
    accessToken: jwt.sign(
      { username: this.username },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME,
      }
    ),
    refreshToken: jwt.sign(
      { username: this.username },
      process.env.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_TIME,
      }
    ),
  }
}

module.exports = mongoose.model('User', userSchema)
