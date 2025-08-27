import { and, asc, count, eq, ilike, type SQL } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '#app/database/client.ts'
import { courses, enrollments } from '#app/database/schema.ts'
import { checkRequestJwt } from '../hooks/check-request-jwt.ts'
import { checkUserRole } from '../hooks/check-user-role.ts'
import { getCoursesRouteSchema } from '../route-schemas.ts'

export const getCoursesRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/',
    {
      preHandler: [checkRequestJwt, checkUserRole('manager')],
      schema: getCoursesRouteSchema,
    },
    async (req, reply) => {
      const { search, orderBy, page } = req.query

      const conditions: SQL[] = []

      if (search) {
        conditions.push(ilike(courses.title, `%${search}%`))
      }

      const [result, total] = await Promise.all([
        db
          .select({
            id: courses.id,
            title: courses.title,
            enrollments: count(enrollments.id),
          })
          .from(courses)
          .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
          .orderBy(asc(courses[orderBy]))
          .offset((page - 1) * 2)
          .limit(10)
          .where(and(...conditions))
          .groupBy(courses.id),
        db.$count(courses, and(...conditions)),
      ])

      return reply.send({ courses: result, total })
    },
  )
}

/**
 * const conditions:SQL[] = [] ARRAY DE POSSÍVEIS CONDIÇÕES
 *
 * if (search) {
 * conditions.push(ilike(courses.title, `%${search}%`))
 * }
 *
 * !EXECUTA A SQL QUERY COM AS CONDIÇÕES AO MESMO TEMPO DE FAZER O COUNT
 * const [result, total] = await Promise.all([
 *  db
 *  .select({
 *  id: courses.id,
 *  title: courses.title,
 *  enrollments: count(enrollments.id),
 *  })
 *  .from(courses)
 *  .leftJoin(enrollments, eq(enrollments.courseId, courses.id))  LEFT JOIN PARA VER O NÚMERO DE ALUNOS EM CADA CURSO
 *  .orderBy(asc(courses[orderBy]))
 *  .offset((page - 1) * 2)
 *  .limit(2)
 *  .where(and(...conditions)),
 *  db.$count(courses, and(...conditions)),
 *  .groupBy(courses.id),     AGRUPA POR ID DO CURSO
 *])
 */
