const jsonWebToken = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {

  const user = await User.findOne({ username: request.body.username })
  let correct = false
  if(user !== null) {
    correct = await bcrypt.compare(request.body.password, user.passwordHash)
  }
  if(user===undefined || !correct) {
    return response.status(401).send({ error: 'invalid username or password' })
  } 

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jsonWebToken.sign(userForToken, process.env.SECRET)

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter