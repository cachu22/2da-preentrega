import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtiene la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtiene el directorio base "src"
const __dirname = dirname(dirname(__filename));

export { __filename, __dirname };