export class TattooController {
  constructor ({ tattooModel }) {
    this.tattooModel = tattooModel
  }

  getAll = async (req, res) => {
    const { category } = req.query
    const tattooes = await this.tattooModel.getAll({ category })
    res.json(tattooes)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const tattoo = await this.tattooModel.getById({ id })
    res.json(tattoo)
  }

  create = async (req, res) => {
    const { body, file } = req
    const newTattoo = await this.tattooModel.create({ body, file })
    res.status(201).json(newTattoo)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.tattooModel.delete({ id })
    res.json(result)
  }

  update = async (req, res) => {
    const { id } = req.params
    const { body, file } = req
    const result = await this.tattooModel.update({ id, body, file })
    res.json(result)
  }
}
