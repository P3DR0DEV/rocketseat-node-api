import { fakerPT_BR } from '@faker-js/faker'
import supertest from 'supertest'
import { beforeAll, describe, expect, it } from 'vitest'
import { app } from '#app/app.ts'
import { makeAuthenticatedUser } from '#app/tests/factories/make-user.ts'

describe('Create a course successfully [E2E]', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should create a course successfully', async () => {
    const { token } = await makeAuthenticatedUser({
      role: 'manager',
    })

    const response = await supertest(app.server)
      .post('/courses')
      .set('Content-Type', 'application/json')
      .set('Authorization', `${token}`)
      .send({
        title: fakerPT_BR.lorem.words(4),
        description: fakerPT_BR.lorem.sentence(),
      })

    expect(response.status).toEqual(201)

    expect(response.body).toEqual({
      courseId: expect.any(String),
    })
  })

  it('should return 401 if user is not authenticated', async () => {
    const response = await supertest(app.server)
      .post('/courses')
      .send({
        title: fakerPT_BR.lorem.words(4),
        description: fakerPT_BR.lorem.sentence(),
      })

    expect(response.status).toEqual(401)
  })

  it('should return 403 if user is not a manager', async () => {
    const { token } = await makeAuthenticatedUser({ role: 'student' })

    const response = await supertest(app.server)
      .post('/courses')
      .set('Authorization', `${token}`)
      .send({
        title: fakerPT_BR.lorem.words(4),
        description: fakerPT_BR.lorem.sentence(),
      })

    expect(response.status).toEqual(403)
  })
})
