const express = require("express");
const router = express.Router();
const rootDir = require("../utils/path");
const path= require("path");

router.get("/",(_req,res)=>{
    res.sendFile(path.join(rootDir,"views","shop.html"))
    
})


module.exports = router