import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'tattoodb'
}

const connection = await mysql.createConnection(config)

export class TattooModel {
  static async getAll () {

  }

  static async getById () {

  }

  static async create ({ input }) {

  }

  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
