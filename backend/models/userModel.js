const mongoose = require('mongoose')
const validator = require('validator')

const { Schema } = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please enter username!'],
    minlength: [5, 'Username should have more than 5 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    validate: [validator.isEmpty, 'Username cannot be empty'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email address'],
    unique: true,
    validate: [validator.isEmail, 'Invalid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    select: false,
    minlength: [8, 'Password should have more than 8 characters'],
    validate: [validator.isStrongPassword, 'To weak password'],
  },
  profilePicture: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
})
