import fs from 'fs';
import express from 'express'
export const router = express.Router();

let carts = [];

// Leer los carritos del archivo carts.json al inicio del programa
fs.readFile('carts.json', 'utf8', (err, data) => {
    if (!err) {
        carts = JSON.parse(data); //asignar datos leidos a la variable carts
    }
});

// Ruta POST para crear un nuevo carrito
router.post('/', (req, res) => {
    // Generar un ID único para el nuevo carrito
    const newCartId = generateUniqueCartId();

    // Crear un nuevo carrito con el ID generado y una lista vacía de productos
    const newCart = {
        "id de carrito": newCartId,
        products: []
    };

    // Agregar el nuevo carrito al array de carritos
    carts.push(newCart);

    // Guardar los cambios en el archivo carts.json
    saveCartsToFile(carts);

    // Enviar el nuevo carrito como respuesta
    res.json(newCart);
});

// Función para generar un ID único para el nuevo carrito
function generateUniqueCartId() {
    // Lógica para generar un ID único
    const existingIds = carts.map(cart => cart["id de carrito"]);
    const newId = Math.max(...existingIds, 0) + 1; // Incrementar el ID más alto en 1
    return newId;
}

// Función para guardar los carritos en un archivo JSON
function saveCartsToFile(carts) {
    // Especificar la ruta del archivo donde se guardará la información de los carritos
    const filePath = 'carts.json';
    // Convertir los carritos a formato JSON
    const cartsJSON = JSON.stringify(carts, null, 2);
    // Escribir los carritos en el archivo
    fs.writeFileSync(filePath, cartsJSON);
}

// Ruta para listar todos los productos de un carrito(GET /:cid)
router.get('/:cid', (req, res) => {
    const { cid } = req.params; // Obtener el ID del carrito desde los parámetros de la ruta

    // Buscar el carrito por su ID en el array de carritos
    const cart = carts.find(cart => cart["id de carrito"] === parseInt(cid));
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' }); // Enviar un mensaje de error si el carrito no se encuentra
    }

    // Verificar si el carrito está vacío
    if (cart.products.length === 0) {
        return res.status(404).json({ error: 'El carrito está vacío' });
    }

    // Crear una nueva estructura de respuesta para el array de carrito
    const response = {
        "id de carrito": cart["id de carrito"],
        "products": cart.products.map(product => {
            return {
                "id de producto": product["id de producto"],
                "quantity": product.quantity
            };
        })
    };
    res.json(response); // Enviar los productos del carrito como respuesta
});

    // Método para leer productos desde products.json
    function getProductsFromFile() {
        const data = fs.readFileSync('products.json', 'utf8');
        return JSON.parse(data);
}

// Método para agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    // Obtener los productos del archivo products.json
    const products = getProductsFromFile();

    // Buscar el producto por su ID
    const productToAdd = products.find(product => product.id === parseInt(pid));
    
    // Verificar si el producto existe
    if (!productToAdd) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar si el carrito existe y obtenerlo
    let cartIndex = carts.findIndex(cart => cart["id de carrito"] === parseInt(cid));

    // Si no se encontró el carrito, crear uno nuevo
    if (cartIndex === -1) {
        const newCart = {
            "id de carrito": parseInt(cid),
            products: [{ "id de producto": pid, quantity: 1 }]
        };
        carts.push(newCart); // Agregar el nuevo carrito a la lista de carritos
    } else {
        // Si el carrito ya existe, agregar el producto al carrito existente
        const existingProductIndex = carts[cartIndex].products.findIndex(item => item["id de producto"] === pid);
        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            carts[cartIndex].products[existingProductIndex].quantity++;
        } else {
            // Si el producto no está en el carrito, agregarlo con cantidad 1
            carts[cartIndex].products.push({ "id de producto": pid, quantity: 1 });
        }
    }

    // Guardar los cambios en el archivo después de modificar el carrito
    saveCartsToFile(carts);

    res.json({ message: 'Producto agregado al carrito correctamente', carts });
});

export default router;