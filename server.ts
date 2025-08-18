import { randomUUID } from 'node:crypto'
import fastify from 'fastify'

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

const courses = [
  {
    id: '1',
    title: 'JavaScript',
  },
]

server.get('/courses', (req, reply) => {
  return reply.send({ courses })
})

server.post('/courses', (req, reply) => {
  type Body = {
    title: string
  }

  const courseID = randomUUID()
  const { title } = req.body as Body

  if (!title) {
    return reply.status(400).send({ message: 'Missing title' })
  }

  courses.push({ id: courseID, title })

  return reply.status(201).send({ courseID })
})

server.get('/courses/:id', (req, reply) => {
  type Params = {
    id: string
  }

  const { id } = req.params as Params
  const course = courses.find((course) => course.id === id)

  if (!course) {
    return reply.status(404).send()
  }

  return reply.send(course)
})

server.delete('/courses/:id', (req, reply) => {
  type Params = {
    id: string
  }

  const { id } = req.params as Params
  const index = courses.findIndex((course) => course.id === id)

  if (index === -1) {
    return reply.status(204).send()
  }

  courses.splice(index, 1)

  return reply.status(204).send()
})

server.listen({ port: 3333 }).then(() => {
  console.log('Server listening on port 3333')
})
