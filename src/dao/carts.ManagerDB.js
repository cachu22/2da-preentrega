import { cartsModel } from "./models/carts.models.js";
import { generateUniqueId } from "../utils/utils.js";
import mongoose from "mongoose";

class CartManagerDB {
    constructor(){
        this.model = cartsModel;
    }

    async getCarts(explain = false) {
        const query = this.model.find();
        if (explain) {
          return await query.explain('executionStats');
        }
        return await query;
    }

    async getCartById(_id) { 
        const cart = await this.model.findById(_id).populate('products.product');
        if (!cart) {
            throw new Error('El carrito no se encontró');
        }
        return cart;
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
            const existingProduct = cart.products.find(item => item.product._id.toString() === productId);
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

    async updateCartProducts(cartId, updatedProducts) {
        try {
            // Buscar el carrito por su ID en la base de datos
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe');
            }
    
            // Iterar sobre el arreglo de productos actualizados
            for (const updatedProduct of updatedProducts) {
                const { productId, quantity } = updatedProduct;
    
                // Buscar si el producto ya existe en el carrito
                const existingProductIndex = cart.products.findIndex(product => product.product.toString() === productId);
    
                if (existingProductIndex !== -1) {
                    // Si el producto ya está en el carrito, aumentar su cantidad
                    cart.products[existingProductIndex].quantity += quantity;
                } else {
                    // Si el producto no está en el carrito, agregarlo
                    cart.products.push({ product: productId, quantity });
                }
            }
    
            // Guardar los cambios en el carrito en la base de datos
            await cart.save();
    
            // Devolver el carrito actualizado
            return cart;
        } catch (error) {
            throw new Error('Error al actualizar los productos del carrito: ' + error.message);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            console.log(`Buscando el carrito con ID: ${cartId}`);
            const cart = await this.model.findById(cartId);
            if (!cart) {
                console.error('El carrito no existe');
                throw new Error('El carrito no existe');
            }

            console.log(`Carrito encontrado: ${JSON.stringify(cart)}`);
            console.log(`Buscando el producto con ID: ${productId} en el carrito`);
            
            // Verificar el contenido del carrito antes de buscar el producto
            cart.products.forEach((item, index) => {
                console.log(`Producto ${index + 1}: ${JSON.stringify(item)}`);
            });

            // Asegurarnos de que ambos IDs se comparen como ObjectId
            const product = cart.products.find(item => 
                new mongoose.Types.ObjectId(item.product).equals(new mongoose.Types.ObjectId(productId))
            );
            if (!product) {
                console.error('El producto no está en el carrito');
                throw new Error('El producto no está en el carrito');
            }

            console.log(`Actualizando la cantidad del producto a: ${quantity}`);
            product.quantity = quantity;

            console.log('Guardando el carrito actualizado');
            await cart.save();

            console.log('Carrito actualizado exitosamente');
            return cart;
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error);
            throw new Error('Error al actualizar la cantidad del producto en el carrito: ' + error.message);
        }
    }
    
    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('El carrito no existe');
            }
    
            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);
            if (productIndex === -1) {
                throw new Error('El producto no está en el carrito');
            }
    
            cart.products.splice(productIndex, 1);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al eliminar el producto del carrito: ' + error.message);
        }
    }

    async emptyCart(cartId) {
        try {
            // Buscar el carrito por su ID en la base de datos
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe');
            }
    
            // Vaciar los productos del carrito
            cart.products = [];
    
            // Guardar los cambios en el carrito en la base de datos
            await cart.save();
    
            // Devolver el carrito actualizado
            return cart;
        } catch (error) {
            throw new Error('Error al vaciar el carrito: ' + error.message);
        }
    }
}

export default CartManagerDB;