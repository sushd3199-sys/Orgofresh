import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: Array, required: true},
    image: {type: Array, required: true},
    category: {type: String, required: true},
    inStock: {type: Boolean, default:true},

    quantityOptions: [
      {
        value: { type: Number, required: true },   // 500, 1, 2
        unit: { type: String, required: true },    // g, kg, bunch
        price: { type: Number, required: true },   // selling price
        originalPrice: { type: Number, required: true } // MRP
      }
    ]
   
}, {timestamps: true})

const Product = mongoose.models.product || mongoose.model('product', productSchema)

export default Product 
  