import { Router } from 'express'
import { TattooController } from '../controllers/tattoo.js'

export const createTattooRouter = ({ tattooModel }) => {
  const tattooRouter = Router()

  const tattooController = new TattooController({ tattooModel })

  tattooRouter.get('/', tattooController.getAll)
  tattooRouter.get('/:id', tattooController.getById)

  return tattooRouter
}

export const tattooRouter = Router()
