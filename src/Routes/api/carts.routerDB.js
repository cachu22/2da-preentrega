import { Router } from "express";
import CartManagerDB from "../../dao/carts.ManagerDB.js";
import { adminOrUserAuth } from "../../middlewares/Auth.middleware.js"

const cartsRouterMSG = Router()
const cartService = new CartManagerDB

// Ruta para traer todos los carros
cartsRouterMSG.get('/', async (req, res) => {
    const carts = await cartService.getCarts()
    console.log(carts);
    res.send (carts) 
} )

// Ruta para traer un carro por su id
cartsRouterMSG.get('/:cid', adminOrUserAuth, async (req, res) => {
    const { cid } = req.params;
    try {
        console.log('ID del carrito:', cid); // Log para verificar el ID del carrito
        const result = await cartService.getCartById(cid);
        if (!result) {
            res.status(404).send({ status: 'error', message: 'No se encontró el ID especificado' });
        } else {
            // Si el resultado incluye una propiedad 'products', la enviamos en la respuesta
            if (result.products) {
                res.send({ status: 'success', payload: { cart: result, products: result.products } });
            } else {
                res.send({ status: 'success', payload: { cart: result, products: [] } }); // Enviar una lista vacía si no hay productos
            }
        }
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al buscar el carrito por ID' });
    }
});

// Ruta POST para crear un nuevo carrito
cartsRouterMSG.post('/', adminOrUserAuth, async (req, res) => {
    try {
        const newCart = await cartService.createCart(); // Espera a que se cree el carrito
        res.json(newCart); // Enviar el nuevo carrito como respuesta
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' }); // Manejo de errores
    }
});

// Ruta para agregar productos al carrito
cartsRouterMSG.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Verificar si la cantidad es válida
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad del producto no es válida' });
        }

        // Obtener el carrito por su ID
        const cart = await cartService.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'El carrito no existe' });
        }

        // Llamar al método addProductToCart del cartManager
        const result = await cartService.addProductToCart(cid, pid, quantity);
        res.json(result);
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

// Ruta PUT para actualizar un carrito con un arreglo de productos
cartsRouterMSG.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { productId, quantity } = req.body;

        // Verificar si se proporcionó un productId y una cantidad válida
        if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: 'Se requiere un productId y una cantidad válida' });
        }

        // Obtener el carrito por su ID
        const cart = await cartService.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'El carrito no existe' });
        }

        // Llamar al método addProductToCart del cartManager
        const result = await cartService.addProductToCart(cid, productId, quantity);
        
        res.json({ status: 'success', payload: result });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

cartsRouterMSG.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        console.log(`ID del carrito: ${cid}`);
        console.log(`ID del producto: ${pid}`);
        console.log(`Cantidad recibida: ${quantity}`);

        // Verificar si la cantidad es válida
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            console.error('Cantidad no válida');
            return res.status(400).json({ error: 'Se requiere una cantidad válida' });
        }

        // Actualizar la cantidad del producto en el carrito
        const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);

        console.log('Carrito actualizado:', updatedCart);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

// Ruta para eliminar un producto de un carrito en DB
cartsRouterMSG.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // Obtener el carrito por su ID
        const cart = await cartService.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'El carrito no existe' });
        }

        // Llamar al método removeProductFromCart del cartManager
        const result = await cartService.removeProductFromCart(cid, pid);
        if (result) {
            res.json({ status: 'success', message: 'Producto eliminado del carrito' });
        } else {
            res.status(500).json({ status: 'error', message: 'Error al eliminar el producto del carrito' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

// Ruta para vaciar el carrito
cartsRouterMSG.delete('/:cid/products', async (req, res) => {
    try {
        const { cid } = req.params;

        // Vaciar el carrito
        const updatedCart = await cartService.emptyCart(cid);

        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
});

export { cartsRouterMSG };