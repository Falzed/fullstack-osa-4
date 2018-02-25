const Blog = require('../models/blog')

const blogsInDb = async () => {
    const response = await Blog.find({})
    return response
}

module.exports = { blogsInDb }