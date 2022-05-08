const validator = require('validator')
const asyncErrorMiddleware = require('../middleware/asyncErrorMiddleware')
const Product = require('../models/productModel')
const ErrorHandler = require('../tools/errorHandler')
const ProductsFilter = require('../tools/productsFilter')

exports.addProduct = asyncErrorMiddleware(async (req, res, next) => {
  let { name, description, price, images, category } = req.body

  if (name && description && category) {
    name = validator.escape(name)
    description = validator.escape(description)
    category = validator.escape(category)
  }

  req.body.user = req.user.username

  const product = await Product.create({
    name,
    description,
    price,
    images,
    category,
    user: req.body.user,
  })

  res.status(200).json({
    success: true,
    product,
  })
})

exports.getAllProducts = asyncErrorMiddleware(async (req, res, next) => {
  const maxProductsPerPage = 6
  const parameters = req.query

  const allProductsCount = await Product.countDocuments()

  for (parameter in parameters) {
    if (parameter !== 'price')
      parameters[parameter] = validator.escape(parameters[parameter])
  }

  const productsFilter = new ProductsFilter(Product, parameters)
    .search()
    .filter()
    .splitIntoPages(maxProductsPerPage)

  const products = await productsFilter.query

  const productsCount = products.length

  res
    .status(200)
    .json({ success: true, allProductsCount, productsCount, products })
})
exports.getProductDetails = asyncErrorMiddleware(async (req, res, next) => {
  let productId = req.params.id

  productId = validator.escape(productId)

  const product = await Product.findById(productId)

  res.status(200).json({
    success: true,
    product,
  })
})
exports.deleteProduct = asyncErrorMiddleware(async (req, res, next) => {
  let productId = req.params.id

  productId = validator.escape(productId)

  const product = await Product.findByIdAndDelete(productId)

  if (!product) {
    return next(new ErrorHandler('Product not found', 404))
  }

  res.status(200).json({
    success: true,
    message: 'Product removed successfully',
  })
})
exports.rateProduct = asyncErrorMiddleware(async (req, res, next) => {
  let { value, productId } = req.body

  if (!value || !productId) {
    return next(new ErrorHandler('Please enter rating and product id', 400))
  } else if (typeof value !== 'number') {
    return next(new ErrorHandler('Invalid value', 400))
  }

  const user = req.user

  productId = validator.escape(productId)

  let product = await Product.findById(productId)

  if (!product) {
    return next(new ErrorHandler('Product not found', 404))
  }

  const newRating = {
    value,
    user: user.username,
  }

  const isRated = product.ratings.find(
    (rating) => rating.user === user.username
  )

  if (isRated) {
    const index = product.ratings.indexOf(isRated)
    product.ratings.splice(index, 1)
  } else {
    product.ratings.push(newRating)
  }

  product = await product.save()

  const ratingsCount = product.ratings.length

  let avarageRating = 0

  product.ratings.forEach((rating) => (avarageRating += rating.value))

  avarageRating = parseFloat(avarageRating / ratingsCount)

  res.status(200).json({
    success: true,
    avarageRating: avarageRating || 0,
    message: isRated ? 'Rating was deleted' : 'Rating successfully added',
  })
})
exports.updateProduct = asyncErrorMiddleware(async (req, res, next) => {
  let { name, description, price, images, category } = req.body

  if (name && description && category) {
    name = validator.escape(name)
    description = validator.escape(description)
    category = validator.escape(category)
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      price,
      images,
      category,
      user: req.body.user,
    },
    { new: true, runValidators: true }
  )

  if (!product) {
    return next(new ErrorHandler('Product not found', 404))
  }

  res.status(200).json({
    success: true,
    product,
  })
})
