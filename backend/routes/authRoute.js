const {
  registerUser,
  loginUser,
  activateUser,
  resendActivationToken,
} = require('../controllers/authController')

const router = require('express').Router()

router.route('/auth/register').post(registerUser)
router.route('/auth/login').post(loginUser)

router.route('/auth/activate/:token').put(activateUser)
router.route('/auth/resend').post(resendActivationToken)

module.exports = router
