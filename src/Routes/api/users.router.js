import express from 'express';
import userManager from '../../dao/user.Manager.js'

const usersRouter = express.Router()
const userService = new userManager();

// Endpoint para traer todos los usuarios de la DB
usersRouter.get('/', async (req, res) => {
    const result = await userService.getUsers();
    console.log(users)
    res.send({status: 'success', payload: result})
})

export default usersRouter