import mysql from 'mysql2/promise'
import { extname } from 'path'

const urlBase = 'http://localhost:3000/uploads'

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
        `SELECT idTattoo, tattoo.name, imageURL, category.name as category 
        FROM tattoodb.tattoo 
        INNER JOIN tattoodb.category ON tattoo.categoryId = category.idCategory ;`
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
      `SELECT idTattoo, tattoo.name, imageURL, category.name as Category 
      FROM tattoo INNER JOIN category ON tattoo.categoryId = category.idCategory 
      WHERE tattoo.idTattoo = ?`, [id]
    )

    if (!tattoo) return { err: 'Tattoo not found' }

    const tattooFullUrl = tattoo.map(tattoo => ({
      ...tattoo,
      imageURL: urlBase + tattoo.imageURL
    }))

    return tattooFullUrl
  }

  static async create ({ body, file }) {
    const { name, categoryName } = body
    const fileExtension = extname(file.originalname)
    const fileName = file.filename.split(fileExtension)[0]
    const fileFullName = `uploads/${fileName}${fileExtension}`
    console.log(file.filename)
    try {
      const [category] = await connection.query(
        `SELECT idCategory FROM category 
        WHERE name = ?`, [categoryName]
      )

      const newTattoo = await connection.query(
        `INSERT INTO tattoodb.tattoo (name, categoryId, imageURL)
        VALUES (?, ?, ?)`, [name, category[0].idCategory, fileFullName]
      )

      const [insertTattoo] = await connection.query(
        `SELECT idTattoo, tattoo.name, imageURL, category.name as Category 
      FROM tattoo INNER JOIN category ON tattoo.categoryId = category.idCategory 
      WHERE tattoo.idTattoo = ?`, [newTattoo[0].insertId]
      )

      return insertTattoo
    } catch (error) {
      // throw new Error('An error has ocurred while creating a Tattoo, please try again.')
      console.log(error)
    }
  }

  static async delete ({ id }) {
    const result = await connection.query(
      `DELETE FROM tattoodb.tattoo 
      WHERE idTattoo = ?`, [id]
    )

    if (result[0].affectedRows === undefined) return { message: 'There is no tattoo with the  given id. Try again please.' }
    else return { message: 'Tattoo has been succesfully deleted.' }

    // TODO agregar manjeador de error
  }

  static async update ({ id, input }) {

  }
}
