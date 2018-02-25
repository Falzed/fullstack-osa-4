const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const { notesInDb, usersInDb } = require('./test_helper')


describe('', async () => {

    describe('when there is initially one user at db', async () => {
        beforeAll(async () => {
            await User.remove({})
            const user = new User({ username: 'asdf0', password: 'zxcv' })
            await user.save()
        })

        test('POST /api/users succeeds with a fresh username', async () => {
            const usersBeforeOperation = await usersInDb()

            const newUser = {
                username: 'test1',
                name: 'tester1',
                password: 'qwerty'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersAfterOperation = await usersInDb()
            expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
            const usernames = usersAfterOperation.map(user => user.username)
            expect(usernames).toContain(newUser.username)
        })

        test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
            const usersBeforeOperation = await usersInDb()

            const newUser = {
                username: 'test1',
                name: 'tester1',
                password: 'asdf'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body).toEqual({ error: 'Username already taken' })

            const usersAfterOperation = await usersInDb()
            expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
        })

        test('POST /api/users fails with proper statuscode and message if password too short', async () => {
            const usersBeforeOperation = await usersInDb()

            const newUser = {
                username: 'test123',
                name: 'tester124214',
                password: 'a'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body).toEqual({ error: 'Password must be at least 3 characters long' })

            const usersAfterOperation = await usersInDb()
            expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
        })
    })

    afterAll(() => {
        server.close()
    })

})