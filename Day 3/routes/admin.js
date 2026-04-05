const rootDir = require("../utils/path");
const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/add-product",(_req,res)=>{
   res.sendFile(path.join(rootDir,"views","add-product.html"))
    
})
router.post("/add-product",(req,res)=>{
 
   res.redirect("/")
    
})



module.exports = router