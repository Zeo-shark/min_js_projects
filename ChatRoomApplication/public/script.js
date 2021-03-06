

const socket =io('http://localhost:3000')
const messageContainer= document.getElementById('message-container')
const roomContainer= document.getElementById('room-container')
const messageForm= document.getElementById('send-container')
const messageInput= document.getElementById('message-input')

if(messageForm!= null){
    const name= prompt('What is your name?')
    appendMessage('You joined')
    socket.emit('new-user', roomName, name)

    messageForm.addEventListener('submit', e=>{
        e.preventDefault()
        const message=messageInput.value
        appendMessage(`You:${message}`)
        socket.emit('send-chat-message',roomName, message)
        messageInput.value=''
    })
}



socket.on('room-created',room=>{
    // <% Object.keys(rooms).forEach(room=> {%>
    //     <%= room %>
    //     <a href="/<%= room %>">Join</a>
    const roomElement = document.createElement('div')
    rootElement.innerText= room
    const roomLink= document.createElement('a')
    roomLink.href=`/${room}`
    roomLink.innerText='Join'
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
})

socket.on('chat-message',data=>{
    appendMessage(`${data.name}:${data.message}`)

})

socket.on('user-connected',name=>{
    appendMessage(`${name} connected`)
})

socket.on('user-disconnected',name=>{
    appendMessage(`${name} disconnected`)
})



function appendMessage(message) {
    const messageElement= document.createElement('div')
    messageElement.innerText= message
    messageContainer.append(messageElement)
}