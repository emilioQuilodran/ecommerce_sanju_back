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

            return user
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async getOrCreateByProvider(data){
        const userData = {
            provider:{
                [data.provider]:true
            },
            idProvider:{
                [data.provider]:data.idProvider
            }
        }
        let user = await UserModel.findOne(userData)
        if(!user){
            data.password = uuid.v4()
            const newData ={
                ...data,
                ...userData
            }
            let stripeCustomerID
            try {
                /*const customer = await stripe.customers.create({
                    name:data.name,
                    email:data.email
                })*/
                //stripeCustomerID = customer.id
                user = await UserModel.create({
                    ...newData,
                    //stripeCustomerID
                })
            } catch (error) {
                //const customer = await stripe.customers.del(stripeCustomerID)
                if(error.code===11000 && error.keyValue.email){ // Duplicated entry
                    const email = error.keyValue.email
                    const provider = "provider."+data.provider
                    const idProvider = "idProvider."+data.provider
                    user = await UserModel.findOneAndUpdate({
                        email
                    },{
                        [provider]:true,
                        [idProvider]:data.idProvider
                    },{new:true})

                    // {"$set":{
                    // "userObjects":{
                    //     "$mergeObjects":[
                    //     "$userObjects",
                    //     {"newerItem":"newervalue","newestItem":"newestvalue"}
                    //     ]
                    // }
                    // }}
                    return {
                        created:true,
                        user
                    }
                }
                return dbError(error)
            }
        }
        return {
            created:true,
            user
        }
        
    }

    async create(data){
        let paypalCustomerID
        try{
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
}

module.exports = User

