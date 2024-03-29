const fs = require('fs');

// Clase ProductManager
class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  // Método para agregar un producto
  addProduct(product) {
    // Validación de campos obligatorios del producto
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      throw new Error('Todos los campos son obligatorios');
    }

    const products = this.getProductsFromFile(); // Obtiene la lista de productos desde el archivo

    // Validación para evitar códigos de productos repetidos
    if (products.find(prod => prod.code === product.code)) {
      throw new Error(`El código ${product.code} ya está siendo utilizado por otro producto.`);
    }

    // Creación de un nuevo producto con un nuevo ID y los campos del producto recibido
    const newProduct = {
      id: this.getNextId(products), // Asigna un nuevo ID al producto
      ...product
    };

    products.push(newProduct); // Agrega el nuevo producto a la lista de productos
    this.saveProductsToFile(products); // Guarda la lista de productos actualizada en el archivo
    return newProduct; // Devuelve el nuevo producto agregado
  }

  // Método para obtener todos los productos
  getProducts() {
    return this.getProductsFromFile(); // Retorna la lista de productos desde el archivo
  }

  // Método para obtener un producto por su ID
  getProductById(productId) {
    const products = this.getProductsFromFile(); // Obtiene la lista de productos desde el archivo
    return products.find(product => product.id === productId); // Busca y retorna el producto con el ID especificado
  }

  // Método para actualizar un producto
  updateProduct(productId, updatedFields) {
    const products = this.getProductsFromFile(); // Obtiene la lista de productos desde el archivo
    const index = products.findIndex(product => product.id === productId); // Encuentra el índice del producto con el ID especificado
    if (index !== -1) { // Si se encuentra el producto
      products[index] = { ...products[index], ...updatedFields }; // Actualiza los campos del producto
      this.saveProductsToFile(products); // Guarda la lista de productos actualizada en el archivo
      return products[index]; // Retorna el producto actualizado
    } else {
      throw new Error('Producto no encontrado'); // Lanza un error si no se encuentra el producto
    }
  }

  // Método para eliminar un producto
  deleteProduct(productId) {
    let products = this.getProductsFromFile(); // Obtiene la lista de productos desde el archivo
    products = products.filter(product => product.id !== productId); // Filtra los productos para eliminar el producto con el ID especificado
    this.saveProductsToFile(products); // Guarda la lista de productos actualizada en el archivo
  }

  // Método para obtener el siguiente ID para un nuevo producto
  getNextId(products) {
    const maxId = products.reduce((max, product) => Math.max(max, product.id), 0); // Encuentra el máximo ID en la lista de productos
    return maxId + 1; // Retorna el siguiente ID disponible
  }

  // Método para obtener la lista de productos desde el archivo
  getProductsFromFile() {
    if (!fs.existsSync(this.path)) { // Verifica si el archivo de productos existe
      return []; // Si no existe, retorna una lista vacía
    }
    const data = fs.readFileSync(this.path, 'utf8'); // Lee el archivo de productos
    return JSON.parse(data); // Retorna la lista de productos parseada desde el formato JSON
  }

  // Método para guardar la lista de productos en el archivo
  saveProductsToFile(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2)); // Guarda la lista de productos en el archivo en formato JSON
  }
}

// Creación de una instancia de ProductManager con la ruta del archivo de productos
const manager = new ProductManager('products.json');

// Agregar productos (ejemplo)
try {
  manager.addProduct({
    title: "Producto 1",
    description: "Descripción del Producto 1",
    price: 100,
    thumbnail: "imagen1.jpg",
    code: "ABC123",
    stock: 10
  });
  manager.addProduct({
    title: "Producto 2",
    description: "Descripción del Producto 2",
    price: 150,
    thumbnail: "imagen2.jpg",
    code: "DEF456",
    stock: 20
  });
} catch (error) {
  console.error("Error al agregar producto:", error.message);
}

// Obtener todos los productos y mostrarlos por consola
console.log("Productos:", manager.getProducts());

// Obtener un producto por su ID y mostrarlo por consola (suponiendo IDs existentes)
console.log("Producto por ID:", manager.getProductById(1)); 
console.log("Producto por ID:", manager.getProductById(3)); 

// Actualizar un producto (ejemplo)
try {
  manager.updateProduct(1, { price: 120, stock: 15 });
} catch (error) {
  console.error("Error al actualizar producto:", error.message);
}

// Eliminar un producto (ejemplo)
manager.deleteProduct(2);

// Exporta la clase ProductManager para su uso en otros archivos
module.exports = ProductManager;