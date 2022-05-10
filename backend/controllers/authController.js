const User = require('../models/userModel')
const validator = require('validator')
const asyncErrorMiddleware = require('../middleware/asyncErrorMiddleware')
const ErrorHandler = require('../tools/errorHandler')
const sendMail = require('../tools/mailSender')
const getActivationMessage = require('../templates/activationMessage')
const getResetPasswordMessage = require('../templates/resetPasswordMessage')
const crypto = require('crypto-js')
const sendTokens = require('../tools/jwtManager')

exports.registerUser = asyncErrorMiddleware(async (req, res, next) => {
  let { email, username, password } = req.body

  if (!email || !username || !password) {
    return next(
      new ErrorHandler('Plase enter email, username and password', 401)
    )
  }

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
  let token = req.params.token

  token = validator.escape(token)

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
  } else {
    return next(new ErrorHandler('Account activation token expired.', 400))
  }

  res.status(200).json({
    success: true,
    message: 'Account activated successfully',
  })
})

exports.resendActivationToken = asyncErrorMiddleware(async (req, res, next) => {
  let { email } = req.body

  if (!email) {
    return next(new ErrorHandler('Please enter an email address', 401))
  }

  email = validator.escape(email)

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
    success: true,
    message: 'Activation email has been send',
  })
})

exports.loginUser = asyncErrorMiddleware(async (req, res, next) => {
  let { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password', 400))
  }

  email = validator.escape(email)
  password = validator.escape(password)

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  const passwordMatch = await user.comparePasswords(password)

  if (!passwordMatch) {
    return next(new ErrorHandler('Invalid password', 401))
  }

  if (user.accountStatus.activeStatus === false) {
    return next(
      new ErrorHandler(
        'Your account is not active. Plase confrim your email address',
        403
      )
    )
  }

  sendTokens(user, 200, res)
})
exports.logout = asyncErrorMiddleware(async (req, res, next) => {
  res.cookie('accessToken', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    ///secure: true,
  })

  res.cookie('refreshToken', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    ///secure: true,
    path: '/auth/refresh',
  })

  res.json({
    success: true,
    message: 'Logout successfully',
  })

  res.status(200).send()
})
exports.resetPassword = asyncErrorMiddleware(async (req, res, next) => {
  let { email } = req.body

  email = validator.escape(email)

  if (!email) {
    return next(new ErrorHandler('Please enter a email adress', 400))
  }

  const user = await User.findOne({ email })

  if (!user) {
    return next(new ErrorHandler('User not found', 407))
  }

  const resetPasswordToken = user.generateResetPasswordToken()

  await user.save()

  const resetPasswordMessage = getResetPasswordMessage(req, resetPasswordToken)

  try {
    await sendMail({
      email: user.email,
      subject: 'WatShop - Reset your password',
      message: resetPasswordMessage,
    })
  } catch (err) {
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(err.message, 500))
  }

  res.status(200).json({
    success: true,
    message: 'Reset password message send',
  })
})
exports.setNewPassword = asyncErrorMiddleware(async (req, res, next) => {
  let { password } = req.body
  let token = req.params.token

  password = validator.escape(password)
  token = validator.escape(token)

  if (!password) {
    return next(new ErrorHandler('Please type new password', 400))
  }

  const hashedToken = crypto.SHA256(token).toString(crypto.enc.Hex)

  let user = await User.findOne({ resetPasswordToken: hashedToken }).select(
    '+password'
  )

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  if (Date.now() < user.resetPasswordTokenExpire) {
    user.password = password
    user.resetPasswordTokenExpire = undefined
    user.resetPasswordToken = undefined

    await user.save()
  } else {
    return next(new ErrorHandler('Password reset token expired', 400))
  }

  res.status(200).json({
    success: true,
    message: 'The password was changed successfully',
  })
})
