const {mongoose} = require('../config/db');

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, "Name is required"]
    },
    description: {
        type:String,
        required: [true, "description is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    image: {
        type:[String],
        required: [true, "image is required"]
    },
    stock: {
        type: Number,
        required: [true, "stock is requierd"]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

// seria bueno colocar los nombres de los modelos en plural
const ProductModel = mongoose.model("product",productSchema)
module.exports = ProductModel