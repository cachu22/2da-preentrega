// Importa el módulo express
import express, { Router } from 'express'
import exphbs from 'express-handlebars';
import productsRouter from './Routes/products.js';
import { router as cartsRouter } from './Routes/carts.js';
import Handlebars from 'express-handlebars';
import { Server } from 'socket.io';
const productsData = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crea una aplicación express
const app = express();
//Guardar en una constante el listen
const httpServer = // Inicia el servidor y lo hace escuchar en el puerto 8080
app.listen(8080, () => {
    console.log('Escuchando en el puerto 8080'); // Imprime un mensaje en la consola cuando el servidor se inicia correctamente
});

//Servir archivos estaticos
app.use(express.static(__dirname + '/Public'));

//Creacion de socket server
const socketServer = new Server (httpServer);

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Express usará este motor de plantillas
app.engine('handlebars', exphbs());

//setear las direcciones de las vistas
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.get('/realtimeProducts', (req, res) => {
    res.render('realTimeProducts', { products: productsData });
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

socketServer.on('connection', socket =>{
    console.log("nuevo cliente conectado");

    socket.on('message',data => {
        console.log(data);
    })

    socket.emit('socket_individual', 'Este mensaje lo deben recibir los socket')

    socket.broadcast.emit('para_todos_menos_el_actual', 'este evento lo veran todos los sockets menos el actual')

    socketServer.emit ('evento_para_todos', 'este mensaje lo reciben todos los sockets incluido el actual')
});