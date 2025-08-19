import type { FastifyInstance } from 'fastify'
import { createCourseRoute } from './create-course.ts'
import { getCourseByIdRoute } from './get-course-by-id.ts'
import { getCoursesRoute } from './get-courses.ts'

export async function coursesRoutes(app: FastifyInstance) {
  app.register(getCoursesRoute)
  app.register(getCourseByIdRoute)
  app.register(createCourseRoute)
}
