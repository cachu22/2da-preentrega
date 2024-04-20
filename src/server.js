// Importa el módulo express
import express, { Router } from 'express'
import exphbs from 'express-handlebars';
import productsRouter from './Routes/products.router.js';
import {router as view} from './Routes/realTimeProducts.router.js'
import { router as cartsRouter } from './Routes/carts.router.js';
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
const io = new Server (httpServer);

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Express usará este motor de plantillas
const handlebars = exphbs.create();
app.engine('handlebars', handlebars.engine);

//setear las direcciones de las vistas
app.set('view engine', 'handlebars');

app.set('views', __dirname + '/views');

//Middleware
app.use(productsSocket(io))

app.get('/home', (req, res) => {
    res.render('home', { products: productsData });
});

                                // Ruta para mostrar la información en tiempo real de los carritos
                                app.get('/realtimeproducts', (req, res) => {
                                    // Filtrar el carrito que deseas mostrar
                                    const cartToShow = cartData.find(cart => cart['id de carrito'] === 3); // Cambia '3' por el ID del carrito que deseas mostrar

                                    if (!cartToShow) {
                                        // Si no se encuentra el carrito, puedes manejarlo como desees, por ejemplo, mostrando un mensaje de error
                                        res.status(404).send('El carrito no fue encontrado');
                                        return;
                                    }

                                    const cartInfo = {
                                        id: cartToShow['id de carrito'],
                                        products: cartToShow.products.map(product => ({
                                            id: product['id de producto'],
                                            quantity: product.quantity,
                                            thumbnails: product.thumbnails // Agregar la imagen al objeto del producto
                                        }))
                                    };

                                    // Renderizar la plantilla con la información del carrito seleccionado
                                    res.render('realTimeProducts', { cart: cartInfo });
                                });

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

io.on('connection', socket =>{
    console.log("nuevo cliente conectado");

    // socket.on('message',data => {
    //     console.log(data);
    // })

    // socket.emit('socket_individual', 'Este mensaje lo deben recibir los socket')

    // socket.broadcast.emit('para_todos_menos_el_actual', 'este evento lo veran todos los sockets menos el actual')

    // socketServer.emit ('evento_para_todos', 'este mensaje lo reciben todos los sockets incluido el actual')
    let messages = []

    //enviar mensajes viejos
    socket.on('mensaje_cliente', data =>{
        console.log(data);

        messages.push({id: socket.id, message: data})

        io.emit('message_server', messages)
    })
});

