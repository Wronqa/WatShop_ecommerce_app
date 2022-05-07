const validator = require('validator')
const asyncErrorMiddleware = require('../middleware/asyncErrorMiddleware')
const Product = require('../models/productModel')
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
  const parameters = req.query

  for (parameter in parameters) {
    parameters[parameter] = validator.escape(parameters[parameter])
  }

  const productsFilter = new ProductsFilter(Product, parameters).search()

  const products = await productsFilter.query

  res.status(200).json({ success: true, products })
})
