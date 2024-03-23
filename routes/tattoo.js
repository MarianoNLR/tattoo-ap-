import { Router } from 'express'
import { TattooController } from '../controllers/tattoo.js'

export const createTattooController = ({ tattooModel }) => {
  const tattooRouter = Router

  const tattooController = new TattooController({ tattooModel })

  tattooRouter.get('/', tattooController.getAll)

  return tattooRouter
}

export const tattooRouter = Router()
