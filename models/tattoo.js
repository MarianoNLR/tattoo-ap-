import mysql from 'mysql2/promise'
import path, { extname } from 'path'
import fs from 'fs'

const urlBase = 'http://localhost:3000/uploads/'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'tattoodb'
}

const connection = await mysql.createConnection(config)

export class TattooModel {
  // Get all tattooes from database
  static async getAll ({ category }) {
    let tattooes

    // If there is query params filter by category
    if (category) {
      [tattooes] = await connection.query(
        `SELECT idTattoo, tattoo.name, imageURL, category.name as category 
        FROM tattoodb.tattoo 
        INNER JOIN tattoodb.category ON tattoo.categoryId = category.idCategory 
        WHERE category.name = ?;`, [category]
      )
    } else {
      // Getting all tattooes whitout filter
      [tattooes] = await connection.query(
        `SELECT idTattoo, tattoo.name, imageURL, category.name as category 
        FROM tattoodb.tattoo 
        INNER JOIN tattoodb.category ON tattoo.categoryId = category.idCategory ;`
      )
    }

    if (tattooes.length === 0) return { err: 'Elements not found' }

    // Setting tattooes url
    const tattooesFullUrl = tattooes.map(tattoo => ({
      ...tattoo,
      imageURL: urlBase + tattoo.imageURL
    }))

    return tattooesFullUrl
  }

  // Get tattoo by id
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

  // Create a tattoo
  static async create ({ body, file }) {
    const { name, categoryName } = body
    // Set file data to upload with a specific name pattern
    const fileExtension = extname(file.originalname)
    const fileName = file.filename.split(fileExtension)[0]
    const fileFullName = `${fileName}${fileExtension}`

    // Creating new tattoo and setting his category

    try {
      // Select from category it needed because from frontend will come the name not the id category
      const [categoryID] = await connection.query(
        `SELECT idCategory FROM category 
        WHERE name = ?`, [categoryName]
      )

      // Create new tattoo
      const newTattoo = await connection.query(
        `INSERT INTO tattoodb.tattoo (name, categoryId, imageURL)
        VALUES (?, ?, ?)`, [name, categoryID[0].idCategory, fileFullName]
      )

      // Getting new tattoo's data to return to the user
      const [insertTattoo] = await connection.query(
        `SELECT idTattoo, tattoo.name, imageURL, category.name as Category 
      FROM tattoo INNER JOIN category ON tattoo.categoryId = category.idCategory 
      WHERE tattoo.idTattoo = ?`, [newTattoo[0].insertId]
      )

      return insertTattoo
    } catch (error) {
      // Sending just a message to not send the actual error details
      throw new Error('An error has ocurred while creating a Tattoo, please try again.')
    }
  }

  // Delete a tattoo from db
  static async delete ({ id }) {
    // Get tattoo to be deleted.
    const [tattooData] = await connection.query(
      `SELECT idTattoo, name, imageURL 
      FROM tattoo 
      WHERE idTattoo = ?`, [id]
    )

    // If tattoo does not exist
    if (!tattooData) return { message: 'An error has ocurred.' }

    // Set image path to delete if tattoo exist
    const imagePath = path.join(process.cwd(), 'uploads', tattooData[0].imageURL)
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (error) => {
        if (error) {
          return { message: 'An error has ocurred.' }
        }
      })
    }

    // Delete tattoo from database
    const result = await connection.query(
      `DELETE FROM tattoodb.tattoo
      WHERE idTattoo = ?`, [id]
    )

    if (result[0].affectedRows === undefined) return { message: 'There is no tattoo with the given id. Try again please.' }
    return { message: 'Tattoo has been succesfully deleted.' }
    // TODO agregar manjeador de error
  }

  // Update tattoo's data
  static async update ({ id, body, file }) {
    const { name, categoryName } = body

    // Get tattoo data
    const [tattooData] = await connection.query(
      `SELECT idTattoo, name, imageURL 
      FROM tattoo 
      WHERE idTattoo = ?`, [id]
    )

    // Set imageurl in case user doesnt upload a new image
    let fileFullName = tattooData[0].imageURL

    // If tattoo does not exist
    if (!tattooData) return { message: 'An error has ocurred.' }

    // To get category ID
    const [category] = await connection.query(
      `SELECT idCategory FROM category 
      WHERE name = ?`, [categoryName]
    )

    // If there is a new file set its full name and delete the old image
    if (file !== undefined) {
      const fileExtension = extname(file.originalname)
      const fileName = file.filename.split(fileExtension)[0]
      fileFullName = `${fileName}${fileExtension}`
      const imagePath = path.join(process.cwd(), 'uploads', tattooData[0].imageURL)
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (error) => {
          if (error) {
            return { message: 'An error has ocurred.' }
          }
        })
      }
    }

    // Update tattoo in db
    const update = await connection.query(
      `UPDATE tattoo
      SET name = ?, categoryId = ?, imageURL = ?
      WHERE idTattoo = ?`, [name, category[0].idCategory, fileFullName, id]
    )
    if (update[0].affectedRows === undefined) return { message: 'There is no tattoo with the given id. Try again please.' }

    // Retrieving updated tattoo data
    const updatedData = await connection.query(
      `SELECT idTattoo, tattoo.name, imageURL, category.name as category 
        FROM tattoodb.tattoo 
        INNER JOIN tattoodb.category ON tattoo.categoryId = category.idCategory 
        WHERE idTattoo = ? ;`, [id]
    )

    return updatedData[0]
  }

  // Get all categories
  static async getAllCategory () {
    const [result] = await connection.query(
      `SELECT name
      FROM category`
    )
    return result
  }

  // Get category by id
  static async getCategoryById ({ id }) {
    const result = await connection.query(
      `SELECT * 
      FROM category WHERE idCategory = ?`, [id]
    )

    return result[0]
  }

  static async createCategory ({ body }) {
    const { name } = body
    let capitalized = name.toLowerCase()
    capitalized = name.charAt(0).toUpperCase() + name.slice(1)
    try {
      const newCategory = await connection.query(
        `INSERT INTO tattoodb.category (name)
        VALUES (?)`, [capitalized]
      )

      const [insertedCategory] = await connection.query(
        `SELECT * FROM tattoodb.category 
        WHERE idCategory = ?`, [newCategory[0].insertId]
      )

      return insertedCategory
    } catch (error) {
      throw new Error(error)
    }
  }
}
