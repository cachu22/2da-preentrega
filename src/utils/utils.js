import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Obtiene la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtiene el directorio base "src"
const __dirname = dirname(dirname(__filename));

// Función para generar un ID único
function generateUniqueId() {
    return uuidv4();
}

export { __filename, __dirname, generateUniqueId };