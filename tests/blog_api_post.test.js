const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

/* beforeAll(async () => {
  await Blog.remove({})
}) */

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
    expect(titles[0]).toBe("React patterns")
    expect(titles[alku]).toBe("Type wars")
})

afterAll(() => {
    server.close()
})