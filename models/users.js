import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'tattoodb'
}

const connection = await mysql.createConnection(config)

export class UserModel {
  static async getAll () {
    const [result] = await connection.query(
      `SELECT username, created_at
      FROM user
      `
    )

    return result
  }

  static async getById ({ id }) {
    const [user] = await connection.query(`
      SELECT username, created_at
      FROM user
      WHERE id_user = ?`, [id])

    return user
  }

  static async create ({ body }) {
    const { username, password } = body
    const [existUsername] = await connection.query(
    `SELECT username 
    FROM user 
    WHERE username = ?`, [username])

    if (existUsername.length > 0) return { error: 'invalid username.' }

    const passwordHash = await bcrypt.hash(password, 10)

    await connection.query(
      'INSERT INTO user (username, password) VALUES (?, ?)', [username, passwordHash]
    )

    return { message: 'user created succesfully.', user: { username, password } }
  }

  // static async update ({ id, body }) {
  //   const { username, password } = body

  //   const [usernameData] = await connection.query(
  //     'SELECT username, password FROM user WHERE id_user = ?', [id]
  //   )

  //   if (!usernameData) return { error: 'User does not exists.' }

  //   const update = await connection.query(
  //     `UPDATE user SET username = ?, password = ?`
  //   )
  // }

  static async delete ({ id }) {
    const result = await connection.query(
      'DELETE FROM user WHERE id_user = ?', [id]
    )

    if (result[0].affectedRows === 0) return { error: 'There was an error deleting user. Try again later.' }

    return { message: 'User deleted succesfully.' }
  }

  static async login ({ body }) {
    const { username, password } = body

    const [user] = await connection.query(
      'SELECT * FROM user WHERE username = ?', [username]
    )

    const passwordMatch = user.length === 0 ? false : await bcrypt.compare(password, user[0].password)

    if (!(user && passwordMatch)) {
      return { error: 'invalid password or username' }
    }

    const userToken = {
      id: user[0].id_user,
      username: user[0].username
    }

    const token = jwt.sign(
      userToken,
      'secret'
    )

    return { username: user[0].username, token }
  }
}
