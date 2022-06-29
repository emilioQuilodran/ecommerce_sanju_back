
const paypalClient = require("../libs/paypalClient");
const CartModel = require("../models/cart");
const paypal = require("@paypal/checkout-server-sdk"); // se utiliza para generar las ordenes
const UserModel = require("../models/user");

const mercadoPago = require('mercadopago');

class Payments {
    async createPayPalOrder(idUser){
        const result = CartModel.findById(idUser);
        const total = result.items.reduce((result,item)=>{
            return result+(item._id.price*item.amount)
        },0)*100;

        const request = new paypal.orders.OrdersCreateRequest()
        request.headers["Prefer"]= "return=representation"
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value:total
                    }
                }
            ]
        })

        const response = await paypalClient.execute(request)
        if(response.statusCode !== 201){
            return {
                success: false,
                message: "An error ocurred"
            }
        }
        return {
            success: true,
            orderId: response.result.id // con el id el front pinta la data
        }
    }

    async confirmPaypal(orderId, data){
        switch(data.event_type){
            case 'PAYMENT.CAPTURE.COMPLETED':
                const orderID = data.resource.id
                const user = await UserModel.findOne({paypalOrderId:orderID})
                console.log(user);
                const cart = await CartModel.findByIdAndUpdate(user.id, {
                    items:[],
                },{new:true})
                break;
        }
    }

    async createMPagoPayment(){

        
    }
}

module.exports = Payments