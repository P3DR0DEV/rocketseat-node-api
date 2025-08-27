import { fastifySwagger } from '@fastify/swagger'
import scalarApiReference from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { coursesRoutes } from '#app/routes/courses/index.ts'
import { loginRoute } from './routes/auth/login.ts'

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:h:MM:ss TT Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

//Configuração de validação e serialização do Zod
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

if (process.env.NODE_ENV === 'development') {
  // Registro de Documentação utilizando o swagger/scalar
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Node API - Rocketseat',
        description: 'API criada no curso da rocketseat',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  app.register(scalarApiReference, {
    routePrefix: '/docs',
    configuration: {
      theme: 'kepler',
    },
  })
}
// Registro de Rotas
app.register(loginRoute)

app.register(coursesRoutes, {
  prefix: '/courses',
})

export { app }
