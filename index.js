const express = require("express")
const morgan = require("morgan")
const cookie = require("cookie-parser")
const cors = require("cors")
const { port } = require("./config")
const { connection } = require("./config/db")
const passport = require("passport")

// Routes:
const auth = require("./routes/auth")
const users = require("./routes/users")
const { useGoogleStrategy } = require("./middleware/authProvider")

const app = express()


connection()

// Utilizando middleware
app.use(morgan("dev"))
app.use(express.json())
app.use(cookie())
app.use(cors({
    origin:["http://localhost:3000"],
    credentials:true
}))
app.use(passport.initialize())
// Usando strategias
passport.use(useGoogleStrategy())


// Usando rutas:
auth(app)
users(app)


app.get("/health",(req,res)=>{
    return res.json({
        name:"Ecommerce v2",
        msg: "server running"
    })
})


app.listen(port,()=>{
    console.log("Listening on: http://localhost:"+port)
})