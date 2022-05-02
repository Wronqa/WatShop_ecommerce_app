const User = require('../models/userModel')
const validator = require('validator')
const asyncErrorMiddleware = require('../middleware/asyncErrorMiddleware')
const ErrorHandler = require('../tools/errorHandler')

exports.registerUser = asyncErrorMiddleware(async (req, res, next) => {
  let { email, username, password } = req.body

  email = validator.escape(email)
  username = validator.escape(username)
  password = validator.escape(password)

  const user = new User({
    username,
    email,
    password,
    profilePicture: {
      public_id: 'hrf',
      url: 'fh',
    },
  })

  await user.save()

  res.status(200).json({
    success: true,
    message: 'Register successfully',
  })
})
