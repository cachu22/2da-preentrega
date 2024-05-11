import { cartsModel } from "./models/carts.models.js";
import { generateUniqueId } from "../utils/utils.js";

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
            // Generar un ID único para el carrito
            const cartId = generateUniqueId(); // Función para generar un ID único
            const newCart = await this.model.create({ id: cartId, products: [] });
            console.log('El carro nuevo', newCart);
            return newCart;
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }
    
    async addProductToCart(cartId, productId, quantity) {
        try {
            // Buscar el carrito por su ID en la base de datos
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe');
            }
            
            // Verificar si el producto ya está presente en el carrito
            const existingProduct = cart.products.find(item => item.product.toString() === productId);
            if (existingProduct) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                existingProduct.quantity += quantity;
            } else {
                // Si el producto no está en el carrito, agregarlo con la cantidad especificada
                cart.products.push({ product: productId, quantity });
            }
    
            // Guardar los cambios en el carrito en la base de datos
            await cart.save();
    
            // Devolver el carrito actualizado
            return cart;
        } catch (error) {
            throw new Error('Error al agregar el producto al carrito: ' + error.message);
        }
    }
}

export default CartManagerDB;