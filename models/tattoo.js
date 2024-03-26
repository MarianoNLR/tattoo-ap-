import mysql from 'mysql2/promise'

const urlBase = 'http://localhost:3000/'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'tattoodb'
}

const connection = await mysql.createConnection(config)

export class TattooModel {
  static async getAll ({ category }) {
    let tattooes
    if (category) {
      [tattooes] = await connection.query(
        `SELECT idTattoo, tattoo.name, imageURL, category.name as category 
        FROM tattoodb.tattoo 
        INNER JOIN tattoodb.category ON tattoo.categoryId = category.idCategory 
        WHERE category.name = ?;`, [category]
      )
    } else {
      [tattooes] = await connection.query(
        'SELECT idTattoo, name, categoryId, imageURL FROM tattoo;'
      )
    }

    if (tattooes.length === 0) return { err: 'Elements not found' }

    const tattooesFullUrl = tattooes.map(tattoo => ({
      ...tattoo,
      imageURL: urlBase + tattoo.imageURL
    }))

    return tattooesFullUrl
  }

  static async getById ({ id }) {
    const [tattoo] = await connection.query(
      'SELECT idTattoo, tattoo.name, imageURL, category.name as Category FROM tattoo INNER JOIN category ON tattoo.categoryId = category.idCategory WHERE tattoo.idTattoo = ?', [id]
    )

    if (!tattoo) return { err: 'The given id was not found' }

    const tattooFullUrl = tattoo.map(tattoo => ({
      ...tattoo,
      imageURL: urlBase + tattoo.imageURL
    }))

    return tattooFullUrl
  }

  static async create ({ input }) {

  }

  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
