const CartModel = require("../models/cart")
const UserModel = require("../models/user")
const PaymentsService = require("./payments")

class Cart{

    async getItems(idUser){
        const result = await CartModel.findById(idUser).populate("items._id","name price")

        return result
    }

    async addToCart(idUser,idProduct,amount){
        const result = await CartModel.findByIdAndUpdate(idUser,{
            $push:{
                items:{
                    _id:idProduct,
                    amount
                }
            }
        },{new:true}).populate("items._id","name price")

        return result
    }

    async removeFromCart(idUser,idProduct){
        const result = await CartModel.findByIdAndUpdate(idUser,{
            $pull:{
                items:{
                    _id:idProduct
                }
            }
        },{new:true})

        return result
    }

    async pay(idUser,stripeCustomerID){
        const result = await this.getItems(idUser)
        if(result){
            const total = result.items.reduce((result,item)=>{
                return result+(item._id.price*item.amount)
            },0)*100

            if(total>0){
                const paymentsServ = new PaymentsService()
                const clientSecret = await paymentsServ.createIntent(total,idUser,stripeCustomerID)
                return {
                    success:true,
                    clientSecret
                }
            }else{
                return {
                    success:false,
                    message:"Tu cuenta debe ser mayor a 0"
                }
            }
    
            
        }else{
            return {
                success:false,
                message:"Ocurrió un error"
            }
        }
        
    }

    async create(idUser){
        const cart = await CartModel.create({
            _id:idUser,
            items:[]
        })

        return cart
    }

    // async clearCart(idUser){
    //     const cart = await CartModel.findByIdAndUpdate(idUser,{
    //         items:[]
    //     },{new:true})

    //     return cart
    // }
    async clearCart(stripeCustomerID){
        const user = await UserModel.findOne({stripeCustomerID})
        const cart = await CartModel.findByIdAndUpdate(user.id,{
            items:[]
        },{new:true})

        return cart
    }


}

module.exports = Cart