import fs from 'fs'; // Importa fs como un módulo ES
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Clase ProductManager
class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

// Método para obtener la lista de productos desde el archivo
getProductsFromFile(products) {
  if (!fs.existsSync(this.filePath)) { // Verifica si el archivo de productos existe
      return ["lala"]; // Si no existe, retorna una lista vacía
  }
  const data = fs.readFileSync(this.filePath, 'utf8'); // Lee el archivo de productos
  if (!data.trim()) { // Verifica si el archivo está vacío
      return []; // Si está vacío, retorna una lista vacía
  }
  return JSON.parse(data); // Retorna la lista de productos parseada desde el formato JSON
}

// Método para guardar la lista de productos en el archivo
saveProductsToFile(products) {
  fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
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

  const products = ProductManager.getProductsFromFile(); // Obtiene la lista de productos desde el archivo

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
  console.log("Entrando en generateUniqueId");
  
  // Obtener todos los IDs existentes
  const existingIds = new Set(products.map(product => product.id));
  console.log("Existing IDs:", existingIds);

  // Iniciar desde 1
  let newId = 1;

  // Mientras el nuevo ID ya exista en la lista de IDs
  while (existingIds.has(newId)) {
    console.log(`El ID ${newId} ya existe en la lista de IDs`);
    
    // Incrementar el ID
    newId++;
  }
  
  console.log("Nuevo ID único:", newId);

  // Devolver el nuevo ID único
  return newId;
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

  // Método para obtener la lista de productos desde el archivo
  getProductsFromFile() {
    console.log("Ruta del archivo de productos:", this.path);
    if (!fs.existsSync(this.path)) {
        console.log("El archivo de productos no existeeee.");
        return [];
    }
    const data = fs.readFileSync(this.path, 'utf8');
    if (!data.trim()) {
        console.log("El archivo de productos está vacíoooo.");
        return [];
    }
    return JSON.parse(data);
  }

  // Método para imprimir los productos almacenados en el archivo
  printProductsFromFile() {
    const products = this.getProductsFromFile();
    console.log("Productos en el archivo:");
    console.log(products);
  }
  }

  // Creación de una instancia de ProductManager con la ruta del archivo de productos
  const manager = new ProductManager(`${__dirname}/file/products.json`);

// Exporta la clase ProductManager para su uso en otros archivos
export default ProductManager;