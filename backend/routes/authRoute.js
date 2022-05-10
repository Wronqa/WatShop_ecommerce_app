const {
  registerUser,
  loginUser,
  activateUser,
  resendActivationToken,
  logout,
  resetPassword,
} = require('../controllers/authController')

const { checkAuthentication } = require('../middleware/authentication')

const router = require('express').Router()

router.route('/auth/register').post(registerUser)
router.route('/auth/login').post(loginUser)
router.route('/auth/check').post(checkAuthentication)
router.route('/auth/activate/:token').put(activateUser)
router.route('/auth/resend').post(resendActivationToken)
router.route('/auth/logout').post(logout)
router.route('/auth/reset').post(resetPassword)

module.exports = router
