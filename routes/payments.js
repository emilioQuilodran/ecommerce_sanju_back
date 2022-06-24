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

}

module.exports = payments