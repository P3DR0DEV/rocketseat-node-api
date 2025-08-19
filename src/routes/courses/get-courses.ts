import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '#app/database/client.ts'
import { courses } from '#app/database/schema.ts'
import { getCoursesRouteSchema } from '../route-schemas.ts'

export const getCoursesRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/',
    {
      schema: getCoursesRouteSchema,
    },
    async (_req, reply) => {
      const result = await db
        .select({
          id: courses.id,
          title: courses.title,
        })
        .from(courses)

      return reply.send({ courses: result })
    },
  )
}
