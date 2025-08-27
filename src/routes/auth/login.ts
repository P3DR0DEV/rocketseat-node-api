import { verify } from 'argon2'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import jwt from 'jsonwebtoken'
import { db } from '#app/database/client.ts'
import { users } from '#app/database/schema.ts'
import { loginRouteSchema } from '../route-schemas.ts'

export const loginRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/auth/sign-in',
    {
      schema: loginRouteSchema,
    },
    async (req, reply) => {
      const { email, password } = req.body

      const result = await db.select().from(users).where(eq(users.email, email))

      if (result.length === 0) {
        return reply.status(400).send({ message: 'Invalid credentials' })
      }

      const user = result[0]

      const validPassword = await verify(user.password, password)

      if (!validPassword) {
        return reply.status(400).send({ message: 'Invalid credentials' })
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined')
      }

      const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      })

      return reply.status(200).send({ token })
    },
  )
}
