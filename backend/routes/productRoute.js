const router = require('express').Router()
const {
  addProduct,
  getAllProducts,
} = require('../controllers/productController')

const {
  checkAuthentication,
  isAdminCheck,
} = require('../middleware/authentication')

router.route('/product/add').post(checkAuthentication, isAdminCheck, addProduct)
router.route('/product/all').get(checkAuthentication, getAllProducts)

module.exports = router
