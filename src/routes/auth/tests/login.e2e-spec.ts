import supertest from 'supertest'
import { beforeAll, describe, expect, it } from 'vitest'
import { app } from '#app/app.ts'
import { makeUser } from '#app/tests/factories/make-user.ts'

describe('Login [E2E]', () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should return a token', async () => {
    const { user, password } = await makeUser()

    const response = await supertest(app.server).post('/auth/sign-in').set('Content-Type', 'application/json').send({
      email: user.email,
      password,
    })

    expect(response.status).toEqual(200)

    expect(response.body).toMatchObject({
      token: expect.any(String),
    })
  })

  it('should return 400 if email or password is invalid', async () => {
    const response = await supertest(app.server).post('/auth/sign-in').set('Content-Type', 'application/json').send({
      email: 'invalid@email.com',
      password: 'invalid',
    })

    expect(response.status).toEqual(400)
  })

  it('should return 400 if a valid email types a invalid password', async () => {
    const { user } = await makeUser()

    const response = await supertest(app.server).post('/auth/sign-in').set('Content-Type', 'application/json').send({
      email: user.email,
      password: 'invalid',
    })

    expect(response.status).toEqual(400)
  })
})
