import ProductManager from '../managers/product.Manager.js';
import fs from 'fs';
import { __dirname } from './utils.js';

// Función para manejar la adición de un nuevo producto
export function handleAddProduct(productData, manager, io) {
    try {
        // Verificar si los datos del producto están presentes
        if (!productData || typeof productData !== 'object') {
            throw new Error('Datos del producto no válidos');
        }

        // Obtener la lista actualizada de productos
        const updatedProducts = manager.getProducts();

        // Validar si el código del producto ya existe
        if (updatedProducts.find(prod => prod.code === productData.code)) {
            // Emitir un evento al cliente para indicar que el código ya está en uso
            io.emit('codeExists', { message: `El código ${productData.code} ya está siendo utilizado por otro producto. Por favor, elija otro código.` });
            return; // Salir del proceso de agregar producto si el código ya existe
        }

        // Generar un nuevo ID único para el producto
        const newProductId = manager.generateUniqueId(updatedProducts);

        // Agregar el nuevo producto al array de productos
        const newProduct = {
            id: newProductId,
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
        updatedProducts.push(newProduct);

        // Guardar los productos actualizados en el archivo products.json
        fs.writeFileSync(__dirname + '/../file/products.json', JSON.stringify(updatedProducts, null, 2));

        // Emitir un evento 'productAdded' con los datos del nuevo producto
        io.emit('productAdded', newProduct);

    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
}