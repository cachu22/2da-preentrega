// Importa el módulo express
import express from 'express';
import exphbs from 'express-handlebars';
import productsRouter from './Routes/products.router.js';
import { router as cartsRouter } from './Routes/carts.router.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { productsSocket } from './utils/productsSocket.js';
import ProductManager from './managers/product.Manager.js';
import { handleAddProduct } from './utils/crearProducto.js';
import { deleteProduct } from '../src/utils/eliminarProducto.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const productsData = JSON.parse(fs.readFileSync(__dirname + '/file/products.json', 'utf-8'));

// Cargar los datos de los carritos desde el archivo carts.json
const cartData = JSON.parse(fs.readFileSync(__dirname + '/file/carts.json', 'utf-8'));

// Establece la ruta completa al archivo JSON que contiene los datos de los productos
// const productsFilePath = `${__dirname}/file/products.json`;

// Crea una aplicación express
const app = express();
const server = createServer(app);

// Crear servidor HTTP utilizando la aplicación express
const httpServer = createServer(app);

// Crear instancia de Socket.IO pasando el servidor HTTP
const io = new Server(httpServer);

// Iniciar el servidor HTTP
httpServer.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080');
});

// Servir archivos estáticos
app.use(express.static(__dirname + '/Public'));

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express usará este motor de plantillas
const handlebars = exphbs.create();
app.engine('handlebars', handlebars.engine);

// Establecer las direcciones de las vistas
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Middleware de Socket.IO
app.use(productsSocket(io));

// Rutas
app.get('/home', (req, res) => {
    res.render('home', { products: productsData });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productsData });
});

app.get('/cart', (req, res) => {
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

    res.render('realTimeProducts', { cart: cartInfo });
});

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Asigna los datos de productos existentes a la variable `products`
let products = productsData;

const manager = new ProductManager(`${__dirname}/file/products.json`);

// Maneja eventos de conexión aquí
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    
    socket.on('addProduct', (productData) => {
        handleAddProduct(productData, manager, io);
        console.log('datos recibidos desde el cliente', productData);
    });

    socket.on('eliminarProducto', (productId) => {
        deleteProduct(productId, manager, io);
    });
});