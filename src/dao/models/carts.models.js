import { Schema, model } from "mongoose";

const CartSchema = new Schema({
        products: {
          type: [{
            product: {
              type: Schema.Types.ObjectId,
              ref: 'products'
            },
            //quantity: Number
          }]
        }
      })

//odm
export const cartsModel = model('carts', CartSchema);