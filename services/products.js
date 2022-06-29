const ProductModel = require("../models/product")

class Products {
    async getAll(limit=20, page=1){
        const total = await ProductModel.count(); // : number
        const totalPages = Math.ceil(total / limit);

        const skip = (page-1)*limit

        if(totalPages < page || page > totalPages ){
            return {
                success: false,
                message: "Page not found",
            }
        }



        const products = await ProductModel.find().skip(skip).limit(limit); // : limit devuelve la cantidad de elementos a partir de los qq se retiran de skip?
        const nextPage = page === totalPages ? null : "/api/products?page=" + ( page + 1 )
        const prevPage = page === 1 ? null : limit == 20?`/api/products?page=${page}`: `/api/products?page=${page}?limit=${limit}`
        //: validaciones
        return {
            sucess: true,
            data: products,
            total, //count
            page,
            prevPage,
            nextPage,
            totalPages
        }

        return products;
    }
    async getAllProductsByUser(){
        
    }

    async create(data){
        const product = await ProductModel.create(data)

        return product
    }

    async update(id,data){
        try{
            const product = await ProductModel.findByIdAndUpdate(id,data,{new:true})
            return product 
        }catch(error){
            console.log(error)
        }
    }

    async delete(id){
        try{
            const product = await ProductModel.findByIdAndDelete(id)

            return product 
        }catch(error){
            console.log(error)
        }
    }

    async getById(id){
        try{
            const product = await ProductModel.findById(id)
            return product
        }catch(error){
            console.log(error)
        }
    }
}

module.exports = Products;