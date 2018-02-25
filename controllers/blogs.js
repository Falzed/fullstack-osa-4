const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

/* const formatBlog = (blog) => {
    return {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    }
} */

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    if (request.body.title === undefined ||
        request.body.url === undefined) {
        return response.status(400).json({ error: 'no title' })
    }

    const user = await User.findById(request.body.userId)

    console.log(user)
    console.log(request.body.userId)

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
    console.log(user.blogs)
    await user.save()
    console.log(user)
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)

        response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
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
