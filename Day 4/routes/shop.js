const express = require("express");
const router = express.Router();

const path= "/";
const adminData = require("./admin")
router.get("/",(_req,res)=>{
    console.log(adminData.products);
    res.render("shop",{
        pageTitle:"Shop",
        docTitle:"Shop",
        prods:adminData.products,
        pathExists:path === "/" ? "active" : "",
        hasProducts:adminData.products.length>0,
        activeShop:true,
        productCSS:true,
        formsCSS:true,
    })
    
})


module.exports = router