import express from 'express';
import productsManagerDB from "../../dao/product.ManagerDB.js"

const productsRouterDB = express.Router();
const manager = new productsManagerDB();

// Rutas para productos de MongoDB
productsRouterDB.get('/', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 0;
      const result = await manager.getProducts(limit, false);
      console.log(result);
      res.send({ status: 'success', payload: result });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error al obtener todos los productos' });
    }
  });

// Consulta para traer los productos con paginación
productsRouterDB.get('/products', async (req, res) => {
    try {
        const result = await manager.getProducts({ limit: 10, numPage: 1 });
        res.send({ status: 'success', payload: result });
    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        res.status(500).send({ status: 'error', message: 'Error al obtener productos' });
    }
});

// Consulta para traer productos filtrados por categoría:
productsRouterDB.get('/products/category/:category', async (req, res) => {
    const category = req.params.category;
    try {
        const result = await manager.getProducts({ category });
        res.send({ status: 'success', payload: result });
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).send({ status: 'error', message: 'Error al obtener productos por categoría' });
    }
});

// Consulta para traer productos filtrados por disponibilidad
productsRouterDB.get('/products/status/:availability', async (req, res) => {
    const availability = req.params.availability === 'true';
    try {
        const result = await manager.getProducts({ availability });
        res.send({ status: 'success', payload: result });
    } catch (error) {
        console.error('Error al obtener productos por disponibilidad:', error);
        res.status(500).send({ status: 'error', message: 'Error al obtener productos por disponibilidad' });
    }
});

//Consulta para traer productos ordenados por precio
productsRouterDB.get('/products/sort/:sortByPrice/:order', async (req, res) => {
    const sortByPrice = req.params.sortByPrice === 'price' ? 'price' : null;
    const order = req.params.order === 'asc' ? 1 : req.params.order === 'desc' ? -1 : null;

    // Imprimir los valores recibidos en la consola para depurar
    console.log('sortByPrice:', sortByPrice);
    console.log('order:', order);

    if (!sortByPrice || order === null) {
        return res.status(400).send({ status: 'error', message: 'Parámetros de ordenamiento no válidos' });
    }

    try {
        const result = await manager.getProducts({ sortByPrice, order });
        res.send({ status: 'success', payload: result });
    } catch (error) {
        console.error('Error al obtener productos ordenados por precio:', error);
        res.status(500).send({ status: 'error', message: 'Error al obtener productos ordenados por precio' });
    }
});

// Ruta para traer un producto por su id
productsRouterDB.get('/:pid', async (req, res) => {
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
productsRouterDB.post('/', async (req, res) => {
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
productsRouterDB.put('/:pid', async (req, res) => {
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
productsRouterDB.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await manager.deleteProduct(pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al eliminar el producto', error: error.message });
    }
});

export default productsRouterDB;