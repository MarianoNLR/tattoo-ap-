import express, { json } from 'express'
import { createTattooRouter } from './routes/tattoo.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import bodyParser from 'body-parser'
import { createUserRouter } from './routes/users.js'

export const createApp = ({ tattooModel, userModel }) => {
  const app = express()
  app.use(cors())
  app.disable('x-powered-by')
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  const imageDirectory = join(__dirname, 'uploads')

  app.use(json())

  app.use('/uploads', express.static(imageDirectory))

  app.use('/tattoo', createTattooRouter({ tattooModel }))
  app.use('/users', createUserRouter({ userModel }))

  const PORT = process.env.PORT ?? 3000

  app.listen(PORT, () => {
    console.log(`Server is listening on port http://localhost:${PORT}`)
  })
}
