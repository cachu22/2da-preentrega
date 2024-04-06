const fs = require('fs');

// Clase ProductManager
class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

// Método para obtener la lista de productos desde el archivo
getProductsFromFile() {
  if (!fs.existsSync(this.path)) { // Verifica si el archivo de productos existe
      return []; // Si no existe, retorna una lista vacía
  }
  const data = fs.readFileSync(this.path, 'utf8'); // Lee el archivo de productos
  if (!data.trim()) { // Verifica si el archivo está vacío
      return []; // Si está vacío, retorna una lista vacía
  }
  return JSON.parse(data); // Retorna la lista de productos parseada desde el formato JSON
}

// Método para obtener todos los productos
getProducts() {
  return this.getProductsFromFile(); // Retorna la lista de productos desde el archivo
}

// Método para agregar un nuevo producto
addProduct(product) {
  const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category']; // Campos obligatorios
  for (const field of requiredFields) {
    if (!(field in product)) {
      throw new Error(`El campo ${field} es obligatorio.`);
    }
  }

  const products = this.getProductsFromFile(); // Obtiene la lista de productos desde el archivo

  // Validación para evitar códigos de productos repetidos
  if (products.find(prod => prod.code === product.code)) {
    throw new Error(`El código ${product.code} ya está siendo utilizado por otro producto.`);
  }
  if (products.find(prod => prod.id === product.id)) {
    throw new Error(`El ID ${product.id} ya esta siendo utilizado por otro producto.`)
  }

  // Generar un ID único automáticamente
  const newProductId = this.generateUniqueId(products);

  // Establecer status por defecto y asegurarse de que thumbnails sea un array
  const newProduct = {
    id: newProductId, // Utiliza el nuevo ID generado automáticamente
    status: true, // Status es true por defecto
    thumbnails: [], // Inicializa thumbnails como un array vacío
    ...product
  };

  // Agregar el nuevo producto a la lista de productos
  products.push(newProduct);
  this.saveProductsToFile(products); // Guarda la lista de productos actualizada en el archivo

  return newProduct; // Devuelve el nuevo producto agregado
}

// Método para generar un ID único para un nuevo producto
generateUniqueId(products) {
  const existingIds = new Set(products.map(product => product.id)); // Obtener todos los IDs existentes
  let newId = 1; // Iniciar desde 1
  while (existingIds.has(newId)) { // Mientras el nuevo ID ya exista en la lista de IDs
    newId++; // Incrementar el ID
  }
  return newId; // Devolver el nuevo ID único
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
    // Excluye la propiedad 'id' del objeto updatedFields para evitar que se actualice
    const { id, ...fieldsToUpdate } = updatedFields;
    products[index] = { ...products[index], ...fieldsToUpdate }; // Actualiza los campos del producto
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
    code: "aABC12a3",
    stock: 10,
    category: "ropas"
  });
  manager.addProduct({
    title: "Producto 2",
    description: "Descripción del Producto 2",
    price: 150,
    thumbnail: "imagen2.jpg",
    code: "DEF45s6s",
    stock: 20,
    category: "ropas"
  });
} catch (error) {
  console.error("Error al agregar producto:", error.message);
}

// Actualizar un producto (ejemplo)
try {
  manager.updateProduct(1, { price: 120, stock: 15 });
} catch (error) {
  console.error("Error al actualizar producto:", error.message);
}

// Exporta la clase ProductManager para su uso en otros archivos
module.exports = ProductManager;