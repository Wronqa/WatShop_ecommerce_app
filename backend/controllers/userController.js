const User = require('../models/userModel')
const validator = require('validator')
const asyncErrorMiddleware = require('../middleware/asyncErrorMiddleware')
const ErrorHandler = require('../tools/errorHandler')
const sendMail = require('../tools/mailSender')

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
  ///await user.save()

  const activationMessage = `Your activation link is: \n\n ${
    req.protocol
  }://${req.get('host')}/user/confrim/${activationToken}
  `

  await sendMail({
    email: user.email,
    subject: 'WatShop - Active you account',
    message: activationMessage,
  })

  res.status(200).json({
    success: true,
    message: 'Register successfully',
  })
})
