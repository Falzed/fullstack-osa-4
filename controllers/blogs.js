const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/* const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
} */

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

    try {
        /* const token = getTokenFrom(request) */
        /* const decodedToken = jwt.verify(token, process.env.SECRET) */
        const decodedToken = jwt.verify(request.token, process.env.SECRET)

        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        if (request.body.title === undefined ||
            request.body.url === undefined) {
            return response.status(400).json({ error: 'no title' })
        }

        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes,
            user: user._id
        })

        if (blog.likes === undefined) {
            blog.likes = 0
        }
        const savedBlog = await blog.save()

        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(Blog.format(savedBlog))
    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).json({ error: 'Unknown error' })
        }
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)

        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const blog = await Blog.findById(request.params.id)

        if (blog.user.toString() !== decodedToken.id.toString()) {
            return response.status(401).json({ 
                error: 'You can only remove blogs added by you'
             })
        }


        await Blog.findByIdAndRemove(request.params.id)

        response.status(204).end()
    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(400).send({ error: 'malformatted id' })
        }
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes
    }
    try {
        await Blog.findByIdAndUpdate(request.params.id, blog)

        response.status(200).end()
    }
    catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = blogsRouter
