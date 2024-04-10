export class TattooController {
  constructor ({ tattooModel }) {
    this.tattooModel = tattooModel
  }

  getAll = async (req, res) => {
    const { category } = req.query
    const tattooes = await this.tattooModel.getAll({ category })
    res.json(tattooes)
  }

  getAllCategory = async (req, res) => {
    const result = await this.tattooModel.getAllCategory()
    res.json(result)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const tattoo = await this.tattooModel.getById({ id })
    res.json(tattoo)
  }

  getCategoryById = async (req, res) => {
    const { id } = req.params
    const category = await this.tattooModel.getCategoryById({ id })
    res.json(category)
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

  createCategory = async (req, res) => {
    const { body } = req
    console.log(req.body)
    const newCategory = await this.tattooModel.createCategory({ body })
    res.json(newCategory)
  }
}
