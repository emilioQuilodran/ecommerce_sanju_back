const express = require("express")
const authValidation = require("../middleware/auth")
const PaymentsService = require("../services/payments")

function payments(app){
    const router = express.Router()
    const paymentsService = new PaymentsService();
    app.use("/api/payments",router)


    router.post("/createPaypalOrder",authValidation(1),async (req,res)=>{
        const result = await paymentsService.createPayPalOrder(req.user.id);
        return res.json(result)
    })

    router.post('/createPaymentMP', authValidation(1), async (req, res)=>{
        const result = await paymentsService.createMPagoPayment(req.user.id, req.body.email, req.body.payment_type_id)
        return res.json(result)
    })

    router.get('/availablePaymentMethods', authValidation(1), async (req, res) => {
        const result = await paymentsService.listPaymentMethodsMP()
        return res.json(result)
    })

}

module.exports = payments