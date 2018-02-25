const Blog = require('../models/blog')
const User = require('../models/user')

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs
}

const usersInDb = async () => {
    const users = await User.find({})
    return users
}

module.exports = {
    blogsInDb, usersInDb
}