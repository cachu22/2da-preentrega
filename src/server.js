// Importa el módulo express
import express from 'express';
import Handlebars from 'express-handlebars';
import productsRouterLF from './Routes/api/productsRouterFS.js';
import productsRouterDB from './Routes/api/productsRouterDB.js';
import { router as cartsRouter } from './Routes/api/carts.routerDB.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import { __dirname } from "./utils/utils.js";
import { productsSocket } from './utils/productsSocket.js';
import ProductManager from './dao/product.ManagerFS.js';
import viewsRouter from './Routes/views.router.js'
//importacion de mongoose
import mongoose from 'mongoose';
import { multerSingleUploader }  from './utils/multer.js';
import messageRouter from './Routes/api/messageRouter.js';

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

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Conectar con mongo
mongoose.connect('mongodb+srv://ladrianfer87:u7p7QfTyYPoBhL9j@cluster0.8itfk8g.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0')
console.log('base de datos conectada');

// Express usará este motor de plantillas
app.engine('hbs', Handlebars.engine({
    extname: '.hbs'
}));

// Establecer las direcciones de las vistas
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

// Middleware de Socket.IO
app.use(productsSocket(io));




//Url base / html
                    //url base
                    app.use('/', viewsRouter)

                    //url productos en tiempo real
                    app.use('/realtimeproducts', viewsRouter)

                    //carrito
                    app.use('/cart', viewsRouter)

                    // Usa el router para la subida de archivos
                    app.post('/upload-file', multerSingleUploader, (req, res) => {
                        // Log de imagen subida
                        res.send('¡Imagen subida con éxito!');
                    });        

// Rutas API
app.use('/api/products', productsRouterLF);
app.use('/api/carts', cartsRouter);

// Enrutador para las operaciones relacionadas con MongoDB
app.use('/mgProducts', productsRouterDB);
// Usa el enrutador de mensajes
app.use('/api', messageRouter);

                app.post('/save-message', (req, res) => {
                    const { user, message } = req.body;
                    res.status(200).send('Mensaje guardado exitosamente');
                });

const manager = new ProductManager(`${__dirname}/file/products.json`);

// Maneja eventos de conexión aquí
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Manejar eventos de mensaje
    socket.on('message', (data) => {
        console.log('Mensaje recibido:', data);
        // Aquí puedes emitir el mensaje a todos los clientes, almacenarlo en una base de datos, etc.
        io.emit('message', data);
    });

    // Manejar evento de desconexión
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
    
});