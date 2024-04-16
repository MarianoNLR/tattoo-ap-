export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  getAll = async (req, res) => {
    const users = await this.userModel.getAll()
    res.json(users)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const user = await this.userModel.getById({ id })
    res.json(user)
  }

  create = async (req, res) => {
    const { body } = req
    const result = await this.userModel.create({ body })
    res.json(result)
  }

  update = async (req, res) => {
    const { id } = req.params
    const { body } = req
    const result = await this.userModel.update({ id, body })
    res.json(result)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.userModel.delete({ id })
    res.json(result)
  }

  login = async (req, res) => {
    const { body } = req
    const result = await this.userModel.login({ body })
    res.json(result)
  }
}
