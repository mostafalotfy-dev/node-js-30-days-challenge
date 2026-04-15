const Sequelize = require("sequelize")

const sql = require("../util/database")

const Cart = sql.define("cart",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    
  });

  module.exports = Cart