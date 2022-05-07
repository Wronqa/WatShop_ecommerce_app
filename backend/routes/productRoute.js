const router = require('express').Router()
const {
  addProduct,
  getAllProducts,
  getProductDetails,
} = require('../controllers/productController')

const {
  checkAuthentication,
  isAdminCheck,
} = require('../middleware/authentication')

router.route('/product/add').post(checkAuthentication, isAdminCheck, addProduct)
router.route('/product/all').get(getAllProducts)
router.route('/product/get/:id').get(getProductDetails)

module.exports = router
