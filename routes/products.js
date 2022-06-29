const express = require('express');
const authValidation = require('../middleware/auth');
const ProductsService = require("../services/products")

function products(app){
    const router = express.Router();
    const productsServ = new ProductsService()

    app.use('/api/products', router)

    router.get('/',async (req, res) => {
        const page = isNaN(parseInt(req.query.page)) ? undefined : parseInt(req.query.page)
        const limit = isNaN(parseInt(req.query.limit)) ? undefined : parseInt(req.query.limit)
        console.log(page, limit)
        const result = await productsServ.getAll(limit, page)
        return res.json(result)
    });

    router.get("/:id", authValidation(2), async (req,res)=>{
        const product = await productsServ.getById(req.params.id,req.body)
        return res.json(product)
    })

    router.post("/",authValidation(1),async (req,res)=>{
        const result = await productsServ.create({
            ...req.body,
            owner:req.user.id
        })

        return res.json(result)
    })
    router.put('/:id', authValidation(2), async (req, res) => {
        const product = await productsServ.update(req.params.id, req.body)
        return res.json(product)
    })

    router.delete("/:id", authValidation(2),async (req,res)=>{
        const product = await productsServ.delete(req.params.id)
        return res.json({msg: "product eliminado"})
    })
}

module.exports = products;