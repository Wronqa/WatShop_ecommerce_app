const User = require('../models/userModel')
const validator = require('validator')
const asyncErrorMiddleware = require('../middleware/asyncErrorMiddleware')
const ErrorHandler = require('../tools/errorHandler')
const sendMail = require('../tools/mailSender')
const getActivationMessage = require('../templates/activationMessage')
const crypto = require('crypto-js')

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

  const activationToken = user.generateActivationToken()

  await user.save()

  const activationMessage = getActivationMessage(req, activationToken)

  try {
    await sendMail({
      email: user.email,
      subject: 'WatShop - Active you account',
      message: activationMessage,
    })
  } catch (err) {
    user.accountStatus.activationToken = undefined
    user.accountStatus.activationTokenExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(err.message, 500))
  }

  res.status(200).json({
    success: true,
    message: 'Register successfully',
  })
})

exports.activateUser = asyncErrorMiddleware(async (req, res, next) => {
  const token = req.params.token

  validator.escape(token)

  if (!token) {
    return next(new ErrorHandler('Token not founded', 404))
  }

  const hash = crypto.SHA256(token).toString(crypto.enc.Hex)

  const user = await User.findOne({ 'accountStatus.activationToken': hash })

  if (!user) {
    return next(new ErrorHandler('Invalid token', 400))
  }

  if (Date.now() < user.accountStatus.activationTokenExpire) {
    user.accountStatus.activeStatus = true
    user.accountStatus.activationToken = undefined
    user.accountStatus.activationTokenExpire = undefined

    await user.save()
  }

  res.status(200).json({
    success: true,
    message: 'Account activated successfully',
  })
})

exports.resendActivationToken = asyncErrorMiddleware(async (req, res, next) => {
  const { email } = req.body

  validator.escape(email)

  const user = await User.findOne({ email })

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  if (user.accountStatus.activeStatus === false) {
    const activationToken = user.generateActivationToken()
    const activationMessage = getActivationMessage(req, activationToken)

    await user.save()

    try {
      await sendMail({
        email: user.email,
        subject: 'WatShop - Active you account',
        message: activationMessage,
      })
    } catch (err) {
      user.accountStatus.activationToken = undefined
      user.accountStatus.activationTokenExpire = undefined

      await user.save({ validateBeforeSave: false })

      return next(new ErrorHandler(err.message, 500))
    }
  } else {
    return next(new ErrorHandler('Your account is active', 400))
  }

  res.status(200).json({
    soccess: true,
    message: 'Activation email has been send',
  })
})
