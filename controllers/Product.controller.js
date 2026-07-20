const express = require("express");
const ProductModel = require("../models/Product.model");

const productPage = async (req, res) => {
    const product = await ProductModel.find()
    res.render("registerProduct", { product })
}

const registerProduct = async (req, res) => {
    try {
        await ProductModel.create(req.body)
        const product = await ProductModel.find()

        res.redirect("/api/v1/productList")
    } catch (error) {
        console.log(error);
        res.status(400).send("Product cannot be registered at this moment")

    }
}

const productList = async (req, res) => {
    try {
        const product = await ProductModel.find()
        res.render("productList", { product })
    } catch (error) {
        console.log(error);
        res.status(400).send("Product cannot be displayed at the moment")
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params

    const { title, description, rating, price, stock } = req.body
    try {
        const isProduct = await ProductModel.findById(id);
        if (!isProduct){
            res.status(400).send({message:"error updating product info"})
            return
        }

        const update = {
            ...(title && {title}), 
            ...(description && {description}),
            ...(rating && {rating}),
            ...(price && {price}),
            ...(stock && {stock})
        }

        const updated = await ProductModel.findByIdAndUpdate(id, update, {returnDocument:"after"});
        res.status(200).send({message: "Product details updated successfully"})


    } catch (error) {
        console.log(error);
        res.status(400).send("Product info cannot be updated")

    }
}

const deleteProduct = async (req, res) => {
    try {
        console.log(req.params.id)
        await ProductModel.findByIdAndDelete(req.params.id)
        const product = await ProductModel.find()
        res.render("productList", { product })
    } catch (error) {
        console.log(error);
        res.status(400).send("Product cannot be deleted")

    }
}

module.exports = { productPage, registerProduct, productList, deleteProduct, updateProduct }