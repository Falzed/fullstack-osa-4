const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const usersRouter = require('./controllers/users')


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoUrl = config.mongoUrl
mongoose.connect(mongoUrl)
mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use(cors())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`environment: ${process.env.NODE_ENV}`)
  console.log(`database: ${mongoUrl}`)
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}