import express, { json } from 'express'
import { createTattooRouter } from './routes/tattoo.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

export const createApp = ({ tattooModel }) => {
  const app = express()

  app.disable('x-powered-by')

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  const imageDirectory = join(__dirname, 'uploads')

  app.use(json())

  app.use('/uploads', express.static(imageDirectory))

  app.use('/tattoo', createTattooRouter({ tattooModel }))

  const PORT = process.env.PORT ?? 3000

  app.listen(PORT, () => {
    console.log(`Server is listening on port http://localhost:${PORT}`)
  })
}
