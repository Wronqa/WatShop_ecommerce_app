const jwt = require('jsonwebtoken')
const asyncErrorMiddleware = require('./asyncErrorMiddleware')
const ErrorHandler = require('../tools/errorHandler')
const User = require('../models/userModel')
const { getRefreshToken } = require('../tools/jwtManager')

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

exports.checkRefreshToken = asyncErrorMiddleware((req, res, next) => {
  const { refreshToken, accessToken } = req.cookies
  const user = req.user

  if (!accessToken || !refreshToken) {
    return next(new ErrorHandler('You are not authenticated', 407))
  }

  if (refreshToken === getRefreshToken(user.username)) {
    const decodedUser = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    )

    if (req.user.username === decodedUser.username) next()
    else {
      return next(new ErrorHandler('Invalid refresh token', 400))
    }
  } else {
    return next(new ErrorHandler('Refresh token is not valid', 400))
  }
})
