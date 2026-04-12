const Sequelize = require("sequelize")
const sql = require("../util/database")
const orderItem = sql.define("orderItem",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    quantity:{
        type:Sequelize.INTEGER,
        allowNull:true
    }
})

module.exports = orderItem