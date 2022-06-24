const express = require("express")
const UserService = require("../services/users")

const authValidation = require("../middleware/auth")

function users(app){
    const router = express.Router()
    const userServ = new UserService()
    app.use("/api/users",router)

    //authValidation(2)
    router.get("/", async (req,res)=>{
        const users = await userServ.getAll() // Array de usuarios
        return res.json(users)
    })
    router.post('/', async (req, res) => {
        const response = await userServ.create(req.body);
        return res.json(response)
    })
    router.get("/:id",async (req,res)=>{
        const user = await userServ.getById(req.params.id,req.body)
        return res.json(user)
    })
}

module.exports = users