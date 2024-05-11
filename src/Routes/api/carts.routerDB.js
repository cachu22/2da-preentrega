import { Router } from "express";
import CartManagerDB from "../../dao/carts.ManagerDB.js";

const cartsRouterMSG = Router()
const cartService = new CartManagerDB

cartsRouterMSG.get('/', async (req, res) => {
    const carts = await cartService.getCarts()
    res.send (carts) 
} )

// Ruta para traer un producto por su id
cartsRouterMSG.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        console.log('ID del carrito:', cid); // Log para verificar el ID del carrito
        const result = await cartService.getCartById(cid); // Corregido: cambia manager por cartService
        if (!result) {
            res.status(404).send({ status: 'error', message: 'No se encontró el ID especificado' });
        } else {
            res.send({ status: 'success', payload: result });
        }
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al buscar el carrito por ID' }); // Corregido: cambia producto por carrito
    }
});

// Ruta POST para crear un nuevo carrito
cartsRouterMSG.post('/', async (req, res) => {
    try {
        const newCart = await cartService.createCart(); // Espera a que se cree el carrito
        res.json(newCart); // Enviar el nuevo carrito como respuesta
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' }); // Manejo de errores
    }
});

// Ruta POST para agregar un producto al carrito
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

export { cartsRouterMSG };