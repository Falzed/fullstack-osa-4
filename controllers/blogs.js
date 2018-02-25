const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

/* const formatBlog = (blog) => {
    return {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    }
} */

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    if (request.body.title === undefined ||
        request.body.url === undefined) {
        return response.status(400).json({ error: 'no title' })
    }

    const blog = new Blog(request.body)
    if (blog.likes === undefined) {
        blog.likes = 0
    }

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

module.exports = blogsRouter
