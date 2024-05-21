
import { Router } from "express";
import fs from 'fs';
import { __dirname } from "../utils/utils.js";
import { multerSingleUploader } from "../utils/multer.js";
import productsManagerDB from "../dao/product.ManagerDB.js";
import CartManagerDB from "../dao/carts.ManagerDB.js";

const productsManagerMongo = new productsManagerDB()

// Cargar los datos de productos localfile
const productsData = JSON.parse(fs.readFileSync(__dirname + '/file/products.json', 'utf-8'));

// Asigna los datos de productos existentes a la variable `products`
let products = productsData;

const router = new Router()
const manager = new CartManagerDB()

// Definir la ruta para renderizar la página principal DB
router.get('/', async (req, res) => {
    const {numPage, limit} = req.query
    try {
        // Consulta todos los productos desde la base de datos utilizando el manager de productos de Mongo
        // const products = await productsManagerMongo.getProducts();
        const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage} = await productsManagerMongo.getProducts({limit, numPage});
        
        // Convertir los productos a objetos planos
        // const productsmg = products.map(product => product.toObject());
        
        // Renderiza la página principal (home) y pasa los productos como datos para su renderización
        res.render('home', {
            products: docs,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        })
        
    } catch (error) {
        // Si hay algún error, devuelve un mensaje de error en formato JSON
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

//Ruta para agregar un nuevo producto DB
// Controlador de ruta para agregar un nuevo producto
async function addProduct(req, res) {
    const newProductData = req.body; // Suponiendo que los datos del nuevo producto se envían en el cuerpo de la solicitud
    try {
        const newProduct = await productsManager.addProduct(newProductData);
        res.status(201).json(newProduct); // Respondemos con el nuevo producto creado
    } catch (error) {
        res.status(500).json({ error: error.message }); // Manejo de errores
    }
}


router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productsData });
});

router.get('/cart', (req, res) => {
    const cartToShow = cartData.find(cart => cart['id de carrito'] === 3);

    if (!cartToShow) {
        res.status(404).send('El carrito no fue encontrado');
        return;
    }

    const cartInfo = {
        id: cartToShow['id de carrito'],
        products: cartToShow.products.map(product => ({
            id: product['id de producto'],
            quantity: product.quantity,
            thumbnails: product.thumbnails
        }))
    };

    res.use('realTimeProducts', { cart: cartInfo });
});

// Ruta para mostrar la vista de un carrito específico
router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        console.log('ID del carrito:', cid); // Log para verificar el ID del carrito
        const result = await manager.getCartById(cid);
        console.log('Datos del carrito:', result); // Log para verificar los datos del carrito

        if (!result) {
            res.status(404).send({ status: 'error', message: 'No se encontró el ID especificado' });
        } else {
            // Convertir el resultado a un objeto plano
            const cart = result.toObject();
            const products = cart.products || [];
            res.render('cart', { cartId: cid, cart, products });
        }
    } catch (error) {
        console.error('Error al buscar el carrito por ID:', error);
        res.status(500).send({ status: 'error', message: 'Error al buscar el carrito por ID' });
    }
});

// Ruta para subir la imagen utilizando multer
router.post('/upload-file', multerSingleUploader, (req, res) => {
    // Log de imagen subida
    res.send('¡Imagen subida con éxito!');
});


// Ruta para agregar un nuevo producto
router.post('/realtimeproducts', addProduct);



export default router
