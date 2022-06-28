const express = require("express")
const authValidation = require("../middleware/auth")
const webhooksService = require("../services/webhooks")

function webhooks(app){
    const router = express.Router()
    const webhooksService = new WebhooksService();
    app.use("/api/webhooks",router)
   
    router.post('/paypal', async (req, res) => {
        console.log(req.body)
        return res.status(200).json({
            msg: "response"
        });
    })
}

module.exports = webhooks