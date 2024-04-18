import express from 'express';
import ProductManager from '../../2doDesafio.js';
const router = express.Router();

// Crea una instancia de ProductManager con el archivo 'products.json'
const manager = new ProductManager('products.json');

// Ruta para listar todos los productos (GET /)
router.get('/', (req, res) => {
    const { limit } = req.query; // Obtiene el parámetro 'limit' de la consulta
    let products = manager.getProducts(); // Obtiene todos los productos del gestor de productos
    
    // Aplica un límite a la lista de productos si se proporciona el parámetro 'limit' en la consulta
    if (limit) {
        products = products.slice(0, parseInt(limit)); // Limita la lista de productos
    }
    
    res.json(products); // Envía la lista de productos como respuesta en formato JSON
});

// Ruta para obtener un producto por su ID (GET /:pid)
router.get('/:pid', (req, res) => {
    
    const { pid } = req.params; // Obtiene el parámetro de ruta 'pid' que representa el ID del producto
    const product = manager.getProductById(parseInt(pid)); // Obtiene el producto por su ID
    
    // Verifica si se encontró el producto y envía una respuesta adecuada
    if (product) {
        res.json(product); // Envía el producto encontrado como respuesta en formato JSON
    } else {
        res.status(404).json({ error: 'Producto no encontrado' }); // Envía un mensaje de error si el producto no se encuentra
    }
});

// Ruta para agregar un nuevo producto con campos (POST /)
router.post('/', (req, res) => {
    const productData = req.body;
    try {
        const newProduct = manager.addProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para actualizar un producto por su ID (PUT /:pid)
router.put('/:pid', (req, res) => {
    const { pid } = req.params; // Obtiene el parámetro de ruta 'pid' que representa el ID del producto
    const productData = req.body; // Obtiene los datos del cuerpo de la solicitud

    try {
        const updatedProduct = manager.updateProduct(parseInt(pid), productData); // Actualiza el producto por su ID
        res.json(updatedProduct); // Envía el producto actualizado como respuesta en formato JSON
    } catch (error) {
        res.status(404).json({ error: error.message }); // Envía un mensaje de error si el producto no se puede actualizar
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', (req, res) => {
    const { pid } = req.params; // Obtiene el parámetro de ruta 'pid' que representa el ID del producto
    try {
        manager.deleteProduct(parseInt(pid)); // Elimina el producto por su ID
        res.status(200).json({ message: 'Producto eliminado correctamente' }); // Envía un mensaje de éxito
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' }); // Envía un mensaje de error si el producto no se puede eliminar
    }
});

export default router;