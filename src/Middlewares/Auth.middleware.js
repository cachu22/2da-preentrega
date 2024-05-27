// Middleware de autorización para administradores y usuarios normales
export function adminOrUserAuth(req, res, next) {
    if (req.session.user) {
        next(); // Permitir acceso si hay una sesión de usuario válida
    } else {
        res.status(403).send('Acceso denegado: Debes iniciar sesión');
    }
}

// Middleware de autorización solo para administradores
export function adminAuth(req, res, next) {
    if (req.session?.user?.isAdmin) { // Asegúrate de usar 'isAdmin'
        next(); // Permitir acceso si es un administrador
    } else {
        res.status(401).send('Acceso no autorizado'); // Devolver un código de estado 401 si no es un administrador
    }
}