const express = require('express')
const bodyParser = require('body-parser')
const errorMiddleware = require('./middleware/errorMiddleware')
require('dotenv').config({ path: __dirname + '/config/.env' })

const app = express()

//Routes
const userRoute = require('./routes/userRoute')

app.use(express.json())
app.use(bodyParser.json())

app.use('/api/', userRoute)

//Middlewares
app.use(errorMiddleware)

module.exports = app
