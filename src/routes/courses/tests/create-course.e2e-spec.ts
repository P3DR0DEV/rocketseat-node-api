import { fakerPT_BR } from '@faker-js/faker'
import supertest from 'supertest'
import { beforeAll, describe, expect, it } from 'vitest'
import { app } from '#app/app.ts'

describe('Create a course successfully [E2E]', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should create a course successfully', async () => {
    const response = await supertest(app.server)
      .post('/courses')
      .set('Content-Type', 'application/json')
      .send({
        title: fakerPT_BR.lorem.words(4),
        description: fakerPT_BR.lorem.sentence(),
      })

    expect(response.status).toEqual(201)

    expect(response.body).toEqual({
      courseId: expect.any(String),
    })
  })
})
