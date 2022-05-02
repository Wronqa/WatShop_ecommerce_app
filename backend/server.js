const app = require('./app')
const connectDatabase = require('./config/database')

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server started on port ' + process.env.SERVER_PORT)
})

connectDatabase()
