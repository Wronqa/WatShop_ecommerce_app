const router = require('express').Router()
const {
  addProduct,
  getAllProducts,
  getProductDetails,
  deleteProduct,
  rateProduct,
  updateProduct,
} = require('../controllers/productController')

const {
  checkAuthentication,
  isAdminCheck,
} = require('../middleware/authentication')

///User routes
router.route('/products').get(getAllProducts)
router.route('/product/rating').post(checkAuthentication, rateProduct)
router.route('/product/:id').get(getProductDetails)

///Admin routes
router
  .route('/admin/product/add')
  .post(checkAuthentication, isAdminCheck, addProduct)

router
  .route('/admin/product/:id')
  .delete(checkAuthentication, isAdminCheck, deleteProduct)
  .put(checkAuthentication, isAdminCheck, updateProduct)

module.exports = router
