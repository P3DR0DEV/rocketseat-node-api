import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { db } from '#app/database/client.ts'
import { courses } from '#app/database/schema.ts'
import { getCourseByIdRouteSchema } from '../route-schemas.ts'

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/:id',
    {
      schema: getCourseByIdRouteSchema,
    },
    async (req, reply) => {
      const { id } = req.params

      const course = await db.select().from(courses).where(eq(courses.id, id))

      if (course.length === 0) {
        return reply.status(404).send()
      }

      return reply.send({ course: course[0] })
    },
  )
}
