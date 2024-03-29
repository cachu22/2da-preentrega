// Importa el módulo express
const express = require('express');

// Importa la clase ProductManager desde el archivo '2doDesafio.js'
const ProductManager = require('./2doDesafio');

// Crea una aplicación express
const app = express();

// Crea una instancia de ProductManager con el archivo 'products.json'
const manager = new ProductManager('products.json');

// Define un manejador para la ruta raíz '/'
app.get('/', (req, res) => {
    res.send('Bienvenido a la página principal'); // Envía un mensaje de bienvenida como respuesta
});

// Define un endpoint para obtener todos los productos
app.get('/products', (req, res) => {
    const { limit } = req.query; // Obtiene el parámetro 'limit' de la consulta
    let products = manager.getProducts(); // Obtiene todos los productos del gestor de productos
    
    // Aplica un límite a la lista de productos si se proporciona el parámetro 'limit' en la consulta
    if (limit) {
        products = products.slice(0, parseInt(limit)); // Limita la lista de productos
    }
    
    res.json(products); // Envía la lista de productos como respuesta en formato JSON
});

// Define un endpoint para obtener un producto por su ID
app.get('/products/:pid', (req, res) => {
    const { pid } = req.params; // Obtiene el parámetro de ruta 'pid' que representa el ID del producto
    const product = manager.getProductById(parseInt(pid)); // Obtiene el producto por su ID
    
    // Verifica si se encontró el producto y envía una respuesta adecuada
    if (product) {
        res.json(product); // Envía el producto encontrado como respuesta en formato JSON
    } else {
        res.status(404).json({ error: 'Producto no encontrado' }); // Envía un mensaje de error si el producto no se encuentra
    }
});

// Inicia el servidor y lo hace escuchar en el puerto 8000
app.listen(8000, () => {
    console.log('Escuchando en el puerto 8000'); // Imprime un mensaje en la consola cuando el servidor se inicia correctamente
});
