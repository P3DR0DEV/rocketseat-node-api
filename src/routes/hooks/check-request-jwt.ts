import type { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

type TokenPayload = {
  sub: string
  role: 'student' | 'manager'
}

export async function checkRequestJwt(req: FastifyRequest, reply: FastifyReply) {
  const token = req.headers.authorization
  if (!token) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload

    req.user = payload
  } catch (error) {
    console.log(error)
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
