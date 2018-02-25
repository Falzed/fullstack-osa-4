const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

/* beforeAll(async () => {
  await Blog.remove({})
}) */

describe('POST:', async () => {
    test('adding blog works', async () => {
        const newBlog = {
            "title": "Type wars",
            "author": "Robert C. Martin",
            "url": "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            "likes": 2,
        }
        const response = await api
            .get('/api/blogs')
        const alku = response.body.length
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const responseAfter = await api
            .get('/api/blogs')
        const titles = responseAfter.body.map(blog => blog.title)

        expect(responseAfter.body.length).toBe(alku + 1)
        expect(titles[alku]).toBe("Type wars")
    })

    test('adding a blog with undefined likes is added with 0 likes', async () => {
        const newBlog = {
            "title": "No one likes me",
            "author": "me",
            "url": "http://cry.cry"
        }
        const response = await api
            .get('/api/blogs')
        const alku = response.body.length
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const responseAfter = await api
            .get('/api/blogs')
        const titles = responseAfter.body.map(blog => blog.title)

        expect(responseAfter.body.length).toBe(alku + 1)
        expect(titles[alku]).toBe("No one likes me")
        expect(responseAfter.body[alku].likes).toBe(0)
    })

    test('adding a blog with no title responds 400', async () => {
        const newBlog = {
            "author": "Robert C. Martin",
            "url": "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            "likes": 2,
        }
        const response = await api
            .get('/api/blogs')
        const alku = response.body.length
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

    test('adding a blog with no url responds 400', async () => {
        const newBlog = {
            "title": "URL-less",
            "author": "Robert C. Martin",
            "likes": 2,
        }
        const response = await api
            .get('/api/blogs')
        const alku = response.body.length
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

    afterAll(() => {
        server.close()
    })
})