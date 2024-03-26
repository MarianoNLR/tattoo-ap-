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
}
