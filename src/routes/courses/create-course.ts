import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '#app/database/client.ts'
import { courses } from '#app/database/schema.ts'
import { createCourseRouteSchema } from '../route-schemas.ts'

export const createCourseRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: createCourseRouteSchema,
    },
    async (req, reply) => {
      const { title, description } = req.body

      const result = await db.insert(courses).values({ title, description }).returning()

      if (result.length === 0) {
        return reply.status(500).send({ message: 'Failed to create course' })
      }

      return reply.status(201).send({ courseId: result[0].id })
    },
  )
}
