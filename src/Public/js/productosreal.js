

console.log("Testeo");

const socket = io()

socket.emit('message', 'esto es data en forma de string')

socket.on('socket_individual', data => {
    console.log(data);
})

socket.on('para_todos_menos_el_actual', data =>{
    console.log(data);
})
socket.on('evento_para_todos', data => {
    console.log(data);
})

