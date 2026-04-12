
const Sequelize = require("sequelize")

const sql = new Sequelize("node-complete", "root", "", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
})

module.exports = sql
