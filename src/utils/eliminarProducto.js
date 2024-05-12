import fs from 'fs';
// import ProductManager from '../managers/product.ManagerFS.js';

// Función para eliminar un producto
export function deleteProduct(productId, manager, io) {
    try {
        // Llama a la función deleteProduct del productManager y pasa el productId
        manager.deleteProduct(productId);

        // Después de eliminar el producto, cargar la lista de productos actualizada
        const updatedProducts = manager.getProducts();

        // Emitir un evento al cliente con la lista actualizada de productos
        io.emit('productosActualizados', updatedProducts);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        // Si hay un error, puedes emitir un evento de error al cliente para manejarlo en el frontend
        socket.emit('eliminarProductoError', { productId, error: error.message });
    }
}