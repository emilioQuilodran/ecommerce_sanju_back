const express = require("express")
const UserService = require("../services/users")

const authValidation = require("../middleware/auth")

function users(app){
    const router = express.Router()
    const userServ = new UserService()
    app.use("/api/users",router)

    router.get("/", authValidation(2), async (req,res)=>{ // role 2 = admin 
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
    router.delete('/:id', async (req, res) => {
        const response = await userServ.delete(req.params.id)
        return res.json(response)
    })
}

module.exports = users