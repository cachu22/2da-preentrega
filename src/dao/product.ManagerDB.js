import { productModel } from "./models/products.models.js";

class productsManagerDB {
    constructor() {
        this.productModel = productModel;
    }

    //Buscar producto por su ID
    async getProductById(_id) {
        return await this.productModel.findById(_id);
    }

    async getProducts() {
        return await this.productModel.find();
    }

    async addProduct(productData) {
        // Verificar si el código del producto ya existe en la base de datos
        const existingProduct = await this.productModel.findOne({ code: productData.code });
        if (existingProduct) {
            throw new Error(`El código ${productData.code} ya está siendo utilizado por otro producto. Por favor, elija otro código.`);
        }

        // Si el código del producto no existe, crear un nuevo producto
        return await this.productModel.create(productData);
    }

    async updateProduct(productId, updatedFields) {
        return await this.productModel.updateOne({_id: productId}, updatedFields);
    }

    async deleteProduct(productId) {
        return await this.productModel.deleteOne({_id: productId});
    }
}

export default productsManagerDB