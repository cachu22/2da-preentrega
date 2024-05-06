import { Schema, model } from "mongoose";

const cartsCollection = 'productos'

const cartsSchema = new Schema(
    {
        status: String,
        title: String,
        description: String,
        price: Number,
        thumbnails: String,
        code: String,
        stock: Number,
        category: String
      }
)

//odm
export const cartModel = model(cartsCollection, cartsSchema);