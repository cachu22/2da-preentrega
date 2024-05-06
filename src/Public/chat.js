const socket = io();
let user;

Swal.fire({
    title: 'Bienvenidos',
    input: 'text',
    text: 'Indique su nombre',
    icon: 'success',
    inputValidator: value => {
        return !value && 'Necesitas escribir tu nombre para continuar';
    },
    allowOutsideClick: false
})
.then(result => {
    user = result.value;
    console.log(user);
});

const chatInput = document.querySelector('#chatInput');
const chatSendBtn = document.querySelector('#chatSendBtn');
const chatMessages = document.querySelector('#chatMessages'); // Obtener el contenedor de mensajes del chat

chatInput.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        sendMessage();
    }
});

chatSendBtn.addEventListener('click', sendMessage);

function sendMessage() {
    const message = chatInput.value.trim();
    if (message.length > 0) {
        // Enviar el mensaje al servidor
        fetch('/save-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user, message })
        })
        .then(response => {
            if (response.ok) {
                console.log('Mensaje enviado al servidor');
            } else {
                console.error('Error al enviar el mensaje al servidor');
            }
        })
        .catch(error => {
            console.error('Error al enviar el mensaje:', error);
        });

        chatInput.value = '';
    }
}

// Manejar los mensajes recibidos del servidor
socket.on('message', ({ user, message }) => {
    // Crear un elemento para el mensaje
    const messageElement = document.createElement('div');
    messageElement.textContent = `${user}: ${message}`;
    
    // Insertar el mensaje al principio del contenedor de mensajes
    chatMessages.insertAdjacentElement('afterbegin', messageElement);
});