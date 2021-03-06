const router = require('express').Router()
const {
  checkAuthentication,
  isAdminCheck,
} = require('../middleware/authentication')
const {
  getUser,
  deleteUser,
  getAllUser,
  updateUser,
  changePassword,
} = require('../controllers/userController')

///Users route
router
  .route('/user/:username')
  .get(checkAuthentication, getUser)
  .put(checkAuthentication, updateUser)

router.route('/user/password').post(checkAuthentication, changePassword)

///Admin routes
router.route('/admin/users').get(checkAuthentication, isAdminCheck, getAllUser)
router
  .route('/admin/user/:username')
  .delete(checkAuthentication, isAdminCheck, deleteUser)

module.exports = router
