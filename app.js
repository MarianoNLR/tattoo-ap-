import express, { json } from 'express'
import { createTattooRouter } from './routes/tattoo.js'

export const createApp = ({ tattooModel }) => {
  const app = express()

  app.disable('x-powered-by')

  app.use(json())

  app.use('/tattoo', createTattooRouter({ tattooModel }))

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`Server is listening on port http://localhost:${PORT}`)
  })
}
