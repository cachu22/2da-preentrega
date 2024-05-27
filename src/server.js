// Importa el módulo express
import express from 'express';
import Handlebars from 'express-handlebars';
import productsRouterLF from './Routes/api/productsRouterFS.js';
import productsRouterDB from './Routes/api/productsRouterDB.js';
import { cartsRouterMSG } from './Routes/api/carts.routerDB.js';
import { cartsRouterFS } from './Routes/api/carts.routerFS.js'
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import { __dirname } from "./utils/utils.js";
import { productsSocket } from './utils/productsSocket.js';
import ProductManager from './dao/product.ManagerFS.js';
import viewsRouter from './Routes/views.router.js'
import { multerSingleUploader }  from './utils/multer.js';
import routerMSG from './Routes/api/messageRouter.js';
import { handleAddProduct } from './utils/crearProducto.js';
import { deleteProduct } from './utils/eliminarProducto.js';
import usersRouter from './Routes/api/users.router.js';
import { connectDb } from './config/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routerCookie from './Routes/Cookies/pruebas.router.js';
import session from 'express-session';
import sessionsRouter from './Routes/Sessions/sessions.router.js';

//session file storage => persistencia en archivo de la sesión
import FileStore from 'session-file-store'

//Session db storage => persistencia en DB
import MongoStore from 'connect-mongo';

// Cargar los datos de los carritos localfile
const cartData = JSON.parse(fs.readFileSync(__dirname + '/file/carts.json', 'utf-8'));

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
app.use(cookieParser('s3cr3t@Firma'))

//sessions
// app.use(session({
//     secret: 's3cr3etc@d3r',
//     resave: true,
//     saveUninitialized: true
// }))

//file store session
// const FileStorage = FileStore(session)

// app.use(session({
//     store: new FileStorage({
//         path: './sessions',
//         ttl: 100,
//         retries: 0
//     }),
//     secret: 's3cr3etc@d3r',
//     resave: true,
//     saveUninitialized: true
// }))

//Sessions con mongo
app.use(session({
    store:  MongoStore.create({
        mongoUrl:'mongodb+srv://ladrianfer87:u7p7QfTyYPoBhL9j@cluster0.8itfk8g.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        //que la sid dure un día
        ttl: 60 * 60 * 1000 * 24
    }),
    secret: 's3cr3etc@d3r',
    resave: true,
    saveUninitialized: true
}))

//middlewares
app.use('/cookies', routerCookie)

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilitar CORS para todas las solicitudes
app.use(cors());

connectDb()

// Express usará este motor de plantillas
app.engine('hbs', Handlebars.engine({
    extname: '.hbs',
    helpers: {
      eq: (a, b) => a === b
    }
  }));

// Establecer las direcciones de las vistas
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

// Middleware de Socket.IO
app.use(productsSocket(io));

//url base
app.use('/', viewsRouter)

//url productos en tiempo real
app.use('/realtimeproducts', viewsRouter)

//carrito
app.use('/cart', viewsRouter)

// usa el router para RealTime
app.use('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productsData });
});

// Usa el router para la subida de archivos
app.post('/upload-file', multerSingleUploader, (req, res) => {
    // Log de imagen subida
    res.send('¡Imagen subida con éxito!');
});        

// Rutas API Local
//Ruta para productos
app.use('/api/products', productsRouterLF);
// Ruta para carts
app.use('/api/carts', cartsRouterFS);
// Ruta para session
app.use('/api/sessions', sessionsRouter)


        //Rutas para DB
// Enrutador para las operaciones relacionadas con MongoDB
app.use('/mgProducts', productsRouterDB);

//Ruta de carrito en DB
app.use('/api/cartsDB', cartsRouterMSG);

//Ruta para usuarios
app.use('api/usersDB', usersRouter);

//Ruta para mensajeria
app.use('/', routerMSG);

const manager = new ProductManager(`${__dirname}/file/products.json`);

// Manejar eventos de conexión aquí
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Manejar eventos de mensaje
    socket.on('message', (data) => {
        console.log('Mensaje recibido:', data);
        // Emitir el mensaje a todos los clientes, incluido el remitente
        io.emit('message', data);
    });

    // Manejar evento de desconexión
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    socket.on('addProduct', (productData) => {
        handleAddProduct(productData, manager, io);
        console.log('datos recibidos desde el cliente', productData);
    });

    socket.on('eliminarProducto', (productId) => {
        deleteProduct(productId, manager, io);
    });
});

