import { randomUUID } from 'node:crypto'
import supertest from 'supertest'
import { beforeAll, describe, expect, it } from 'vitest'
import { app } from '#app/app.ts'
import { makeCourse } from '#app/tests/factories/make-course.ts'
import { makeAuthenticatedUser } from '#app/tests/factories/make-user.ts'

describe('Get all courses [E2E]', () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should return all courses', async () => {
    const titleId = randomUUID()
    const { token } = await makeAuthenticatedUser({ role: 'manager' })
    await makeCourse({
      title: titleId,
    })

    const response = await supertest(app.server).get(`/courses?search=${titleId}`).set('Authorization', `${token}`)

    expect(response.status).toEqual(200)

    expect(response.body).toMatchObject({
      courses: [
        {
          id: expect.any(String),
          title: titleId,
          enrollments: 0,
        },
      ],
      total: 1,
    })
  })

  it('Should return Unauthorized if user is not a manager', async () => {
    const { token } = await makeAuthenticatedUser({ role: 'student' })

    const response = await supertest(app.server).get('/courses').set('Authorization', `${token}`)

    expect(response.status).toEqual(403)
  })
})
