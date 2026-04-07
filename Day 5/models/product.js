const path = require("path");
const fs = require("fs");
const rootDir = require("../utils/path");
const p = path.join(rootDir, "data", "products.json");
const getProductFromFile = (cb) => {
  fs.readFile(p , (err,fileContent)=>{

    if (err) return cb([]);
    cb(JSON.parse(fileContent));
  })
};
module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    getProductFromFile((products)=>{
      products.push(this)
      fs.writeFile(p,JSON.stringify(products),err=>{
        if(err)
          console.log(err)
      })
    })
    
  }

  static fetchAll(cb) {
   getProductFromFile(cb)
  }
};
