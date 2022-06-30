const dbError = require("../helpers/dbError")
const UserModel = require("../models/user")
const uuid = require("uuid")
const bcrypt = require("bcrypt")
const CartService = require("../services/cart")

class User{
    async getAll(){
        try{
            const users = await UserModel.find()
            // Ya tenemos disponubles los datos
            return users // Array de objetos
        }catch(error){
            console.log(error)
        }
    }

    async getByEmail(email){
        try {
            const user = await UserModel.findOne({email})
            console.log();
            return user
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async getOrCreate(data){
        const user = await UserModel.findOne({provider:data.provider,idProvider:data.idProvider})
        if(user){
            return user
        }
        data.password = uuid.v4()
        return await UserModel.create(data)
    }

    async create(data){
        let paypalCustomerID
        try{
            if(data && data.password){
                data.password = await this.#encrypt(data.password)
            }
        
            const user = await UserModel.create({
                ...data
            })
            const cartServ = new CartService()
            const cart = await cartServ.create(user.id)
            return {
                created:true,
                user
            }
        }catch(error){
            return dbError(error)
        }
    }
    async getById(id, data){
        try{
            const user = await UserModel.findById(id)
            return user
        }catch(error){
            console.log(error)
        }
    }
    async delete(id){
        try{
            const user = await UserModel.findByIdAndDelete(id)
            return user;
        }catch(error){
            console.log(error);
        }
    }
    async update(id,data){
        try{
            const user = await UserModel.findByIdAndUpdate(id,data,{new:true})
            return user 
        }catch(error){
            console.log(error)
        }
    }
    async #encrypt(string){
        try{
            const salt = await bcrypt.genSalt()
            const hash = await bcrypt.hash(string,salt)

            return hash
        }catch(error){
            console.log(error)
        }
    }
}

module.exports = User

