import { Schema, model } from "mongoose";

const CartSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'productos'
        },
        quantity: {
            type: Number
        }
    }]
});

// Middleware para hacer populate automáticamente en find y findOne
CartSchema.pre(['find', 'findOne'], function() {
    this.populate('products.product');
});

export const cartsModel = model('Cart', CartSchema);