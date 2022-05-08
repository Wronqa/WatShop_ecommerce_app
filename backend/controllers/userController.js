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
exports.deleteUser = asyncErrorMiddleware(async (req, res, next) => {
  req.params.username = validator.escape(req.params.username)
  const user = await User.findOneAndDelete({ username: req.params.username })

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  })
})
exports.getAllUser = asyncErrorMiddleware(async (req, res, next) => {
  let users = await User.find()

  users = users.map((user) => {
    const {
      password,
      _id,
      accountStatus,
      updatedAt,
      __v,
      email,
      role,
      ...others
    } = user.toJSON()

    return others
  })

  res.status(200).json({
    success: true,
    users,
  })
})
exports.updateUser = asyncErrorMiddleware(async (req, res, next) => {
  req.params.username = validator.escape(req.params.username)

  let { email, profilePicture } = req.body

  if (email) email = validator.escape(email)

  let user = await User.findOne({ username: req.params.username })

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  if (user.username !== req.user.username && req.user.role !== 'admin') {
    return next(
      new ErrorHandler('You dont have permissions to do this operation', 407)
    )
  }

  user = await User.findOneAndUpdate(
    req.params.username,
    { email, profilePicture },
    { new: true, runValidators: true }
  )

  const { _id, accountStatus, updatedAt, ...others } = user.toJSON()

  res.status(200).json({
    success: true,
    user: others,
  })
})

exports.changePassword = asyncErrorMiddleware(async (req, res, next) => {
  let { oldPassword, newPassword } = req.body

  if (!oldPassword && !newPassword)
    return next(new ErrorHandler('Please enter password', 400))

  oldPassword = validator.escape(oldPassword)
  newPassword = validator.escape(newPassword)

  let user = await User.findOne({ username: req.user.username }).select(
    '+password'
  )

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  const passwordMatch = await user.comparePasswords(oldPassword)

  if (!passwordMatch) {
    return next(new ErrorHandler('Wrong password', 400))
  }

  user.password = newPassword

  await user.save()

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  })
})
