import fs from 'node:fs';
import express from 'express'
import { Router } from 'express';
import CartManager from '../managers/carts.Manager.js';

export const router = Router()
export const cartManager = new CartManager('./src/file/carts.json');
const manager = new CartManager('./src/file/carts.json');

let carts = [];

    // Leer los carritos del archivo carts.json al inicio del programa
    fs.readFile('./src/file/carts.json', 'utf8', (err, data) => {
        if (!err) {
            carts = JSON.parse(data); //asignar datos leidos a la variable carts
        }
    });

    // Ruta para listar todos los carritos (GET /)
    router.get('/', (req, res) => {
        const { limit } = req.query; // Obtiene el parámetro 'limit' de la consulta
        let carts = manager.getCartsFromFile(); // Obtiene todos los carritos del gestor de carritos
        
        // Aplica un límite a la lista de productos si se proporciona el parámetro 'limit' en la consulta
        if (limit) {
            products = carts.slice(0, parseInt(limit)); // Limita la lista de carritos
        }
        
        res.json(carts); // Envía la lista de productos como respuesta en formato JSON
    });

    // Ruta POST para crear un nuevo carrito
    router.post('/', (req, res) => {
        try {
            const newCart = cartManager.createCart(); // Llama al método createCart de cartManager
            res.json(newCart); // Enviar el nuevo carrito como respuesta
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el carrito' }); // Manejo de errores
        }
    });

    // Ruta para listar todos los productos de un carrito(GET /:cid)
    router.get('/:cid', (req, res) => {
        const { cid } = req.params; // Obtener el ID del carrito desde los parámetros de la ruta

        // Obtener el carrito por su ID usando el método getCartById de CartManager
        const cart = cartManager.getCartById(parseInt(cid));

        // Verificar si se encontró el carrito
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' }); // Enviar un mensaje de error si el carrito no se encuentra
        }

        // Verificar si el carrito está vacío
        if (cart.products.length === 0) {
            return res.status(404).json({ error: 'El carrito está vacío' });
        }

    // Crear una nueva estructura de respuesta para el array de carrito
    const response = {
        "id de carrito": cart["id de carrito"],
        "products": cart.products.map(product => {
            return {
                "id de producto": product["id de producto"],
                "quantity": product.quantity
            };
        })
    };
    res.json(response); // Enviar los productos del carrito como respuesta
});

    // Agregar un producto al carrito
    router.post('/:cid/product/:pid', async (req, res) => {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;

            // Llamar al método addProductToCart del cartManager
            const result = await cartManager.addProductToCart(cid, pid);

            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});