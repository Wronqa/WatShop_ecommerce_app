const {
  registerUser,
  activateUser,
  resendActivationToken,
} = require('../controllers/userController')

const router = require('express').Router()

router.route('/register').post(registerUser)

router.route('/user/activate/:token').put(activateUser)
router.route('/user/resend').post(resendActivationToken)

module.exports = router
