async function obtenerProductos() {
    try {
        // Realiza una solicitud GET al servidor para obtener los productos
        const respuesta = await fetch('/api/products');
        // Convierte la respuesta a formato JSON
        const datos = await respuesta.json();
        // Retorna los datos de los productos
        return datos.productos;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        return []; // Retorna una matriz vacía en caso de error
    }
}

// Llama a la función para obtener los productos cuando se cargue la página
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Obtiene los productos del servidor
        const productos = await obtenerProductos();
        // Actualiza la interfaz de usuario con los datos de los productos
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar la página:', error);
    }
});

// Función para mostrar los productos en la interfaz de usuario
function mostrarProductos(productos) {
    // Obtener el contenedor donde se mostrarán los productos
    const contenedorProductos = document.querySelector('.padre-cards');
    // Limpiar cualquier contenido existente en el contenedor
    contenedorProductos.innerHTML = '';
    // Iterar sobre los productos y crear elementos HTML para cada uno
    productos.forEach(producto => {
        // Crear un div para el producto
        const cardProducto = document.createElement('div');
        cardProducto.classList.add('card-servicios');
        // Crear elementos HTML para mostrar la información del producto
        const titulo = document.createElement('p');
        titulo.textContent = producto.title;
        const descripcion = document.createElement('p');
        descripcion.textContent = `Descripción: ${producto.description}`;
        const precio = document.createElement('p');
        precio.textContent = `Precio: ${producto.price}`;
        const codigo = document.createElement('p');
        codigo.textContent = `Código: ${producto.code}`;
        const stock = document.createElement('p');
        stock.textContent = `Stock: ${producto.stock}`;
        const boton = document.createElement('button');
        boton.textContent = 'Agregar al carrito';
        // Agregar los elementos al div del producto
        cardProducto.appendChild(titulo);
        cardProducto.appendChild(descripcion);
        cardProducto.appendChild(precio);
        cardProducto.appendChild(codigo);
        cardProducto.appendChild(stock);
        cardProducto.appendChild(boton);
        // Agregar el div del producto al contenedor
        contenedorProductos.appendChild(cardProducto);
    });
}