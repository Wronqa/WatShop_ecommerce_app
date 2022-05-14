const app = require('./app')
const connectDatabase = require('./config/database')
const normalizePort = require('./tools/normalizePort')

app.listen(normalizePort(process.env.SERVER_PORT) || 3000, () => {
  console.log('Server started on port ' + process.env.SERVER_PORT)
})

connectDatabase()

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
})

process.on('uncaughtException', (error) => {
  console.log('UncaughtException: ', error)

  process.exit(1)
})
