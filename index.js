const express = require("express")
const morgan = require("morgan")
const session = require("express-session")
const cookie = require("cookie-parser")
const cors = require("cors")
const { port, sessionSecret } = require("./config")
const { connection } = require("./config/db")
const passport = require("passport")

// Routes:
const auth = require("./routes/auth")
const users = require("./routes/users")
const products = require('./routes/products');
const cart = require("./routes/cart")
const payments = require("./routes/payments")
const { useGoogleStrategy } = require("./middleware/authProvider")

const app = express()


connection()

// Utilizando middleware
app.use(morgan("dev"))
app.use("/api/webhooks/stripe",express.raw({type: 'application/json'}))
app.use(express.json())
app.use(cookie())
app.use(cors({
    origin:["http://localhost:3000", "http://127.0.0.1:5500"],
    credentials:true
}))
app.use(session({
    secret:sessionSecret,
    resave:false,
    saveUninitialized:false
}))//Redis
app.use(passport.initialize())
// Usando strategias
passport.use(useGoogleStrategy())
passport.serializeUser((user,done)=>{
    done(null,user)
})
passport.deserializeUser((user,done)=>{
    done(null,user)
})


// Usando rutas:
auth(app)
users(app)
products(app);
cart(app)
payments(app);
/*
FRONT :

constraints
// no se puede agregar productos sin estar logeado
// al añadir un product , la cantidad por defecto es 1
// se puede cambiar la cantidad de los productos del carrito

// pagos 

/**
 * sesion inciada 
 * validar que haya productos en el carrito
 * limpiar el estado del carrito
 * 
 * 
 * 
 */


app.get("/health",(req,res)=>{
    return res.json({
        name:"Ecommerce v2",
        msg: "server running"
    })
})


app.listen(port,()=>{
    console.log("Listening on: http://localhost:"+port)
})