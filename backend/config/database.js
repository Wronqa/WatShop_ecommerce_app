const mongoose = require('mongoose')

const connectDatabase = () => {
  mongoose.connect(process.env.MONGOOSE_URL, (error) => {
    if (!error) {
      console.log('Connected to database')
    }
  })
}

module.exports = connectDatabase
