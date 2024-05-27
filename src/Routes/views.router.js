
import { Router } from "express";
import fs from 'fs';
import { __dirname } from "../utils/utils.js";
import { multerSingleUploader } from "../utils/multer.js";
import productsManagerDB from "../dao/product.ManagerDB.js";
import CartManagerDB from "../dao/carts.ManagerDB.js";
import { adminOrUserAuth } from "../middlewares/Auth.middleware.js";
import { adminAuth } from "../middlewares/Auth.middleware.js";

const productsManagerMongo = new productsManagerDB()

// Cargar los datos de productos localfile
const productsData = JSON.parse(fs.readFileSync(__dirname + '/file/products.json', 'utf-8'));

// Asigna los datos de productos existentes a la variable `products`
let products = productsData;

const viewsRouter = new Router()
const manager = new CartManagerDB()

viewsRouter.get('/', async (req, res) => {
    const { numPage, limit } = req.query;
    try {
        // Consulta todos los productos desde la base de datos utilizando el manager de productos de Mongo
        const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = await productsManagerMongo.getProducts({ limit, numPage });

        // Verificar si el usuario está autenticado
        const user = req.session.user || {};

        // Renderiza la página principal (home) y pasa los productos como datos para su renderización
        res.render('home', {
            products: docs,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            isAdmin: user.isAdmin || false // Asegurarse de que isAdmin sea un booleano
        });

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

viewsRouter.get('/login', (req, res) => {
    res.render('login')
})

viewsRouter.post('/login', (req, res) => {
    // Supongamos que has verificado las credenciales del usuario y obtenido el usuario de la base de datos
    const user = getUserFromDatabase(req.body.email);

    // Establecer la sesión del usuario
    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        admin: user.role === 'admin' // Establecer 'admin' en función del rol del usuario
    };

    res.redirect('/adminlogin');
});

// Ruta usando adminOrUserAuth
viewsRouter.get('/adminlogin', adminOrUserAuth, (req, res) => {
    res.render('template-name', {
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        isAdmin: req.session.user.isAdmin
    });
});

viewsRouter.get('/check-session', (req, res) => {
    res.json(req.session.user);
});

// Ruta usando adminAuth
viewsRouter.get('/admin/products', adminAuth, (req, res) => {
    res.render('admin-products', {
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        isAdmin: req.session.user.isAdmin
    });
});

// Ruta para la bienvenida (Datos del cliente)
viewsRouter.get('/welcome', adminOrUserAuth, (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('home', {
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName
    });
});

viewsRouter.get('/register', (req, res) => {
    res.render('register')
})

viewsRouter.get('/realtimeproducts', adminOrUserAuth, (req, res) => {
    res.render('realTimeProducts', { products: productsData });
});

viewsRouter.get('/cart', adminOrUserAuth, (req, res) => {
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
viewsRouter.get('/carts/:cid', adminOrUserAuth, async (req, res) => {
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
viewsRouter.post('/upload-file', multerSingleUploader, adminOrUserAuth, (req, res) => {
    // Log de imagen subida
    res.send('¡Imagen subida con éxito!');
});


// Ruta para agregar un nuevo producto
viewsRouter.post('/realtimeproducts', adminOrUserAuth, addProduct);



export default viewsRouter
