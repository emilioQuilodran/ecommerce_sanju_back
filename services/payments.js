const { mercadoPagoSecretKey } = require("../config")
const paypalClient = require("../libs/paypalClient");
const CartModel = require("../models/cart");
const paypal = require("@paypal/checkout-server-sdk"); // se utiliza para generar las ordenes
const UserModel = require("../models/user");

const mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken(mercadoPagoSecretKey);
const endpointSecret = "whsec_2d849de04e6aa72abd49bf02b669777334504a448b75a97e166203f8fb714ffe";
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

    async listPaymentMethodsMP(){
        try{
            var response = await mercadopago.payment_methods.listAll();
            return response;
        }catch(err){
            console.log(err);
        }
    }

    async createMPagoPayment(idUser, email, type){
        const result = await CartModel.findById(idUser).populate("items._id", "name price")
        const total = result.items.reduce((result,item)=>{
            return result+(item._id.price*item.amount)
        },0)

        const data = await mercadopago.payment.create({
            transaction_amount: total,
            description: 'Pago de productos',
            payment_method_id: type,
            payer: {
              email: email
            }
        })

        console.log(data)
        return data.body;
    }
}

module.exports = Payments