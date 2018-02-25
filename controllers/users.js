const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const users = await User.find({})


    const vanha = users.find(user => user.username === request.body.username)

    if (request.body.password.length < 3) {
        response.status(400).json({
            error: 'Password must be at least 3 characters long'
        })
    } else if (users
        .find(user => user.username === request.body.username) !== undefined) {
        response.status(400).json({
            error: 'Username already taken'
        })
    } else {
        try {
            const body = request.body

            const saltRounds = 10
            const hash = await bcrypt.hash(body.password, saltRounds)
            const adult = body.isAdult !== false
            const user = new User({
                username: body.username,
                name: body.name,
                passwordHash: hash,
                isAdult: adult
            })

            const savedUser = await user.save()

            response.status(201).json(savedUser)
        } catch (exception) {
            console.log(exception)
            response.status(500).json({ error: 'something went wrong...' })
        }
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', { title: 1, author: 1, likes: 1, url: 1 })
    response.json(users.map(User.format))
})

module.exports = usersRouter