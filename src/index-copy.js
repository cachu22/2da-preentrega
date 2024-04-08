// Importa el módulo express
const express = require('express');
const productsRouter = require('./Routes/products');
const cartsRouter = require('./Routes/carts');

//                                      PRODUCTS
// Crea una aplicación express
const app = express();

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());

// Define un manejador que usa el enrutador para la ruta raíz '/api/products'
// Traer todos los productos
app.use('/api/products', productsRouter);

// Define un manejador que usa el enrutador para la ruta '/api/:pid'
// Eliminar un producto por ID
app.use('/:pid', productsRouter);

// Define un manejador que usa el enrutador para la ruta 'POST'
// Agregar un nuevo producto
app.use('/api/products/new', productsRouter);

// Define un manejador que usa el enrutador para la ruta '/api/:pid'
// Modificador de producto
app.use('api/:pid',productsRouter)

//                                      CARTS

//Crear un carrito desde la ruta 'POST /'
app.use('/', cartsRouter)

// Define un manejador que usa el enrutador para la ruta '/api/carts'
// Traer un carrito por ID
app.use('/api/carts', cartsRouter);

//Agregar nuevo producto al carrito
app.use('/api/carts/', cartsRouter);

// Inicia el servidor y lo hace escuchar en el puerto 8080
app.listen(8080, () => {
    console.log('Escuchando en el puerto 8080'); // Imprime un mensaje en la consola cuando el servidor se inicia correctamente
});