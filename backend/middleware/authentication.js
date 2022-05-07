const jwt = require('jsonwebtoken')
const asyncErrorMiddleware = require('./asyncErrorMiddleware')
const ErrorHandler = require('../tools/errorHandler')
const User = require('../models/userModel')

exports.checkAuthentication = asyncErrorMiddleware(async (req, res, next) => {
  const { accessToken } = req.cookies

  if (!accessToken) {
    return next(new ErrorHandler('You are not authenticated', 403))
  }

  const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)

  req.user = await User.findOne({ username: decodedToken.username })

  next()
})

exports.isAdminCheck = asyncErrorMiddleware((req, res, next) => {
  if (req.user.role !== 'admin')
    return next(
      new ErrorHandler('You dont have permissions to do this operation', 403)
    )

  next()
})
