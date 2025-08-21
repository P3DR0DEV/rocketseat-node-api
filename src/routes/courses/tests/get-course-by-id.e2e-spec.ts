import supertest from 'supertest'
import { beforeAll, describe, expect, it } from 'vitest'
import { app } from '#app/app.ts'
import { makeCourse } from '#app/tests/factories/make-course.ts'

describe('Get a course by id [E2E]', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should return a single course', async () => {
    const course = await makeCourse()

    const response = await supertest(app.server)
      .get(`/courses/${course.id}`)

    expect(response.status).toEqual(200)

    expect(response.body).toMatchObject({
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
      }
    })
  })

  it('should return 404 if course not found', async () => {
    const response = await supertest(app.server).get(`/courses/d912a0f6-dcba-4381-88a7-500537196fdb`)

    expect(response.status).toEqual(404)
  })
})
