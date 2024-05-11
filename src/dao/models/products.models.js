  import { Schema, model } from "mongoose";

  const productsCollection = 'productos'

  const productsSchema = new Schema(
      {
          status: Boolean,
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
  export const productModel = model(productsCollection, productsSchema);