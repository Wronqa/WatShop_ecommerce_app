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

router.route('/product/add').post(checkAuthentication, isAdminCheck, addProduct)
router.route('/product/all').get(getAllProducts)
router.route('/product/get/:id').get(getProductDetails)
router
  .route('/product/delete/:id')
  .delete(checkAuthentication, isAdminCheck, deleteProduct)
router.route('/product/rating').post(checkAuthentication, rateProduct)
router
  .route('/product/update/:id')
  .post(checkAuthentication, isAdminCheck, updateProduct)

module.exports = router