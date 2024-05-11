import express from 'express';
import productsManagerDB from "../../dao/product.ManagerDB.js"

const router = express.Router();
const manager = new productsManagerDB();

// Rutas para productos de MongoDB
// Ruta para traer todos los productos
router.get('/', async (req, res) => {
    try {
        // Obtener el parámetro de consulta "limit" de la solicitud, si está presente
        const limit = parseInt(req.query.limit) || 0;

        // Obtener productos con la limitación
        const result = await manager.getProducts(limit);

        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al obtener todos los productos' });
    }
});

// Ruta para traer un producto por su id
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await manager.getProductById(pid);
        if (!result) {
            res.status(404).send({ status: 'error', message: 'No se encontró el ID especificado' });
        } else {
            res.send({ status: 'success', payload: result });
        }
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al buscar el producto por ID' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await manager.addProduct(productData);
        console.log('producto enviado Router', productData);
        res.status(201).json({ status: 'true', payload: newProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al agregar un nuevo producto', error: error.message });
    }
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedProductData = req.body;
    try {
        const result = await manager.updateProduct(pid, updatedProductData);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al actualizar el producto', error: error.message });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await manager.deleteProduct(pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al eliminar el producto', error: error.message });
    }
});

export default router;