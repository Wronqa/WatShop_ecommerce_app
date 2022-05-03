const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middleware/errorMiddleware')

require('dotenv').config({ path: __dirname + '/config/.env' })

const app = express()

//Routes
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')

app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.json())

///app.use('/api/', userRoute)
app.use('/api', authRoute)
app.use('/api', userRoute)

//Middlewares
app.use(errorMiddleware)

module.exports = app
