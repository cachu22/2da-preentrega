import { Router } from "express"
    export const router = Router()
    
    //realTimeProducts para ver los productos en tiempo real
    router.get('/realtimeproducts', (req, res) => {
        res.render('realTimeProducts', {})
    })
