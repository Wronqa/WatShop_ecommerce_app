const mongoose = require('mongoose')

const { Schema } = mongoose

const productModel = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name of product'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter a description'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please enter a price'],
    },
    rating: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, 'Please enter a category'],
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productModel)
