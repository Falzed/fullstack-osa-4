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
    console.log(blog)
    const savedBlog = await blog.save()
    console.log(savedBlog)
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        
        response.status(204).end()
    } catch(exception) {
        console.log(exception)
        response.status(400).send({error: 'malformatted id'})
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
    catch(exception) {
        console.log(exception)
        response.status(400).send({error: 'malformatted id'})
    }
})

module.exports = blogsRouter
