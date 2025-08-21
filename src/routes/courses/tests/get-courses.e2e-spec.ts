import { randomUUID } from 'node:crypto'
import supertest from 'supertest'
import { beforeAll, describe, expect, it } from 'vitest'
import { app } from '#app/app.ts'
import { makeCourse } from '#app/tests/factories/make-course.ts'

describe('Get all courses [E2E]', () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should return all courses', async () => {
    const titleId = randomUUID()
    await makeCourse(titleId)

    const response = await supertest(app.server).get(`/courses?search=${titleId}`)

    expect(response.status).toEqual(200)

    expect(response.body).toMatchObject({
      courses: [
        {
          id: expect.any(String),
          title: titleId,
          enrollments: 0,
        }
      ],
      total: 1,
    })
  })
})
