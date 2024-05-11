import { productModel } from "./models/products.models.js";

class productsManagerDB {
    constructor() {
        this.productModel = productModel;
    }

    //Traer todos los productos
    async getProducts(limit = 0) {
        // Aplicar la limitación al buscar los productos
        return await this.productModel.find().limit(limit);
    }

    //Buscar producto por su ID
    async getProductById(_id) {
        return await this.productModel.findById(_id);
    }

    async addProduct(productData) {
        try {
            // Verificar si ya existe un producto con el mismo código
            const existingProduct = await this.productModel.findOne({ code: productData.code });
            if (existingProduct) {
                console.log('En manager', productData);
                throw new Error('El código ' + productData.code + ' ya está siendo utilizado por otro producto. Por favor, elija otro código.');
            }
    
            // Si el código no está en uso, crear el nuevo producto
            const newProduct = await this.productModel.create(productData);
            return newProduct;
        } catch (error) {
            throw new Error('Error al agregar un nuevo producto: ' + error.message);
        }
    }

    async updateProduct(productId, updatedFields) {
        return await this.productModel.updateOne({_id: productId}, updatedFields);
    }

    async deleteProduct(productId) {
        return await this.productModel.deleteOne({_id: productId});
    }
}

export default productsManagerDB