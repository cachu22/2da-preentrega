import express from 'express';
const routerMSG = express.Router();
import { messageModel } from '../../dao/models/message.models.js';

// Ruta para guardar un nuevo mensaje
routerMSG.post('/save-message', async (req, res) => {
    const { user, message } = req.body;
    try {
        // Guardar el mensaje en la base de datos utilizando el MessageModel
        const newMessage = new messageModel({ user, message });
        const savedMessage = await newMessage.save();
        console.log('Mensaje guardado en la base de datos:', savedMessage);
        res.status(200).send('Mensaje guardado en la base de datos');
    } catch (error) {
        console.error('Error al guardar el mensaje en la base de datos:', error);
        res.status(500).send('Error al guardar el mensaje en la base de datos');
    }
});

export default routerMSG;