const express = require("express")
const { registerProduct, productPage, productList, deleteProduct, updateProduct } = require("../controllers/Product.controller")
const router = express.Router()

router.get("/registerProduct", productPage)
router.post("/deleteProduct/:id", deleteProduct)
router.post("/registerProduct", registerProduct)
router.get("/productList", productList)
router.patch("/updateProduct/:id", updateProduct)

module.exports = router