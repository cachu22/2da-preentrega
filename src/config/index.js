import { connect } from 'mongoose'
import { orderModel } from '../dao/models/order.model.js';

    //Definir operaciones
    const ordenes = [
        {
        title: "Burro de arranque",
        model: "1998",
        price: 25000,
        quantity: 5,
        date: "2024-05-20T21:30:12Z"
    },
    {
        title: "Burro de arranque",
        model: "1999",
        price: 30000,
        quantity: 1,
        date: "2024-05-20T21:30:12Z"
    },
    {
        title: "Burro de arranque",
        model: "2000",
        price: 50000,
        quantity: 3,
        date: "2024-05-20T21:30:12Z"
    }
    ]

export const connectDb = async () => {
    console.log('base de datos config conectada');
    //Conectar con mongo
    connect('mongodb+srv://ladrianfer87:u7p7QfTyYPoBhL9j@cluster0.8itfk8g.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0')

    //Insertar las ordenes
    // let result = await orderModel.insertMany(ordenes)
    // console.log(result);

    //Solicitar las ordenes
    // let result = await orderModel.find({})
    // console.log(result);

    //aggregations stage - Pasos
    const model = '1999'
    let result = await orderModel.aggregate([
        {
            //primer paso
            $match: {model: model}
        },
        {
            $group: {_id: "$title", totalQuantity: {$sum: "$quantity"}}
        },
            //Ordenar el array en orden descendente
        {
            $sort: {totalQuantity: -1}
        },
            //En el campo "orders" va a insertar el array
        {
            $group: {_id: 1, orders: {$push: "$$ROOT"}}
        },
            //Crear id ylo ponga en mongo o se le de un id nuevo de mongo
        {
            $project: {"_id": 0, orders: "$orders"},
        },
        {
            $merge: {into: 'reports'}
        }
        
    ])

    console.log(result);
}