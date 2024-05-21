import { productModel } from "./models/products.models.js";

class productsManagerDB {
    constructor() {
        this.productModel = productModel;
    }

    // Traer todos los productos con filtrado y ordenamiento
async getProducts({ limit = 9, numPage = 1, category, status, sortByPrice, order, explain = false }) {
    try {
        let filter = {};
        if (category) filter.category = category;
        if (status !== undefined) filter.status = status === "true";

        let sort = {};
        if (sortByPrice && order) {
            sort.price = order;
        }

        let query = await this.productModel.paginate(
            filter,
            { 
                limit, 
                page: numPage, 
                sort,
                lean: true 
            }
        );

        if (explain) {
            return await query.explain('executionStats');
        }

        return query;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
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