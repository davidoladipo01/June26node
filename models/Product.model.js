const mongoose = require("mongoose")

const ProductSchema= new mongoose.Schema({
    title: {type: String, required:true},
    description: {type: String, required: true},
    rating: {type: String, required: true},
    price: {type: String, required: true},
    stock: {type: String, required: true}
}, {timestamps: true, strict: "throw"})

const ProductModel = mongoose.model("product", ProductSchema)

module.exports= ProductModel