import { Schema, model } from "mongoose";

const CartProductSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },
    quantity: {
        type: Number,
        default: 1 // Puedes establecer el valor predeterminado que desees
    }
});

const CartSchema = new Schema({
    products: [CartProductSchema]
});

export const cartsModel = model('carts', CartSchema);