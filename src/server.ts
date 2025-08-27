import { app } from '#app/app.ts'

app.listen({ port: 3333, host:'0.0.0.0' }).then(() => {
  console.log('Server listening on port 3333')
})
