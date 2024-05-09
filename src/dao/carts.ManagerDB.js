import { cartsModel } from "./models/carts.models.js";

class CartManagerDB {
    constructor(){
        this.model = cartsModel;
    }

    async getCarts() {
        return await this.model.find();
    }

    async getCartById(_id) { 
        return await this.model.findById(_id);
    }
    
    async createCart() {
        try {
            const newCart = await this.model.create({ products: [] });
            return newCart;
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }
    
    async addProduct(_idCart, _idProduct) {
        try {
            // Buscar el carrito por su ID
            let cart = await this.model.findById(_idCart);
            if (!cart) {
                throw new Error('El carrito no existe');
            }
    
            // Agregar el producto al carrito
            cart.products.push({ product: _idProduct });
    
            // Guardar el carrito actualizado
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw new Error('Error al agregar el producto al carrito: ' + error.message);
        }
    }
}

export default CartManagerDB;