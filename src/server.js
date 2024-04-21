// Importa el módulo express
import express from 'express';
import exphbs from 'express-handlebars';
import productsRouter from './Routes/products.router.js';
import { router as view } from './Routes/realTimeProducts.router.js';
import { router as cartsRouter } from './Routes/carts.router.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { productsSocket } from './utils/productsSocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const productsData = JSON.parse(fs.readFileSync(__dirname + '/file/products.json', 'utf-8'));

// Cargar los datos de los carritos desde el archivo carts.json
const cartData = JSON.parse(fs.readFileSync(__dirname + '/file/carts.json', 'utf-8'));

// Establece la ruta completa al archivo JSON que contiene los datos de los productos
const productsFilePath = __dirname + '/file/products.json';

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

// Manejo de conexiones de Socket.IO
io.on('connection', (socket) => {
    // Registra en la consola cuando un nuevo cliente se conecta
    console.log("Nuevo cliente conectado");

    // Escucha el evento 'addProduct' para agregar un nuevo producto
    socket.on('addProduct', (productData) => {
        // Registra en la consola los datos recibidos desde el formulario
        console.log('Datos recibidos desde el formulario:', productData);
        
        try {
            // Verificar si los datos del producto están presentes
            if (!productData || typeof productData !== 'object') {
                throw new Error('Datos del producto no válidos');
            }

            // Agregar el nuevo producto al array de productos
            const newProduct = {
                //ver la generación de la ID
                status: productData.status,
                title: productData.title,
                description: productData.description,
                price: productData.price,
                thumbnails: productData.thumbnails,
                code: productData.code,
                stock: productData.stock,
                category: productData.category
            };

            // Agregar el nuevo producto al array de productos
            products.push(newProduct);

            // Guardar los productos actualizados en el archivo products.json
            fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
            
            // Emitir un evento 'productAdded' con los datos del nuevo producto
            io.emit('productAdded', newProduct);

        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });
});