import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = 'productos';

const productsSchema = new Schema({
  status: {
    type: Boolean,
    index: true
  },
  title: String,
  model: {
    type: String,
    index: true
  },
  description: String,
  price: Number,
  thumbnails: String,
  code: String,
  stock: Number,
  category: {
    type: String,
    index: true
  }
});

productsSchema.plugin(mongoosePaginate)
export const productModel = model(productsCollection, productsSchema);