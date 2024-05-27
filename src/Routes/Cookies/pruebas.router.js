import { Router } from "express";

const routerCookie = Router()

// session

routerCookie.get('/current', (req, res) => {
    res.send('datos sensibles que solo puede ver el admin')
})

//session acceso y cantidad de visitas al sitio
routerCookie.get('/session', (req, res) => {
if(req.session.counter){
    req.session.counter++
    res.send(`se ha visitado el sitio ${req.session.counter} veces.`)
}else{
    req.session.counter = 1
    res.send('Bienvenidos')
}
})

// Crear endpoint para metodos de cookie
routerCookie.get('/setCookie', (req, res) => {
    //res vamos a mandar una orden al navegador
    res.cookie('cookie','mensaje por cookie', {maxAge: 1000000}).send('cookieRespuesta')
})

// Crear endpoint para metodos de cookie firmada
routerCookie.get('/setCookieSigned', (req, res) => {
    //res vamos a mandar una orden al navegador
    res.cookie('cookie','mensaje por cookie', {maxAge: 1000000, signed: true}).send('cookie signed')
})

routerCookie.get('/getCookie', (req, res) => {
    res.send(req.signedCookies)
})

// Eliminar cookie
routerCookie.get('/deleteCookie', (req, res) => {
    res.clearCookie('cookie').send('cookie borrada')
})

export default routerCookie