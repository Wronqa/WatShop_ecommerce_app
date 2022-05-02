const { registerUser } = require('../controllers/userController')

const router = require('express').Router()

router.route('/register').post(registerUser)

module.exports = router
