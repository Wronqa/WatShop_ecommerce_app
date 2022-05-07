const asyncErrorMiddleware = require('../middleware/asyncErrorMiddleware')
const validator = require('validator')
const User = require('../models/userModel')
const ErrorHandler = require('../tools/errorHandler')

exports.getUser = asyncErrorMiddleware(async (req, res, next) => {
  let username = req.params.username

  username = validator.escape(username)

  const user = await User.findOne({ username })

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  const { password, _id, accountStatus, updatedAt, __v, email, ...others } =
    user.toJSON()

  res.status(200).json({ success: true, user: others })
})
