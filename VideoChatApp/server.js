const express= require('express')
const app= express()

const http= require('http').Server(app)

const io= require('socket.io')(http)
const port= process.env.PORT|| 3000

app.use(express.static(__dirname+"/public"))
let client=0

io.on('connection',function(socket){
    socket.on("NewClient", function(){
        if(client< 2)
        {
            if(client==1){
                this.emit('CreatePeer')
            }
        }
        else{
            this.emit('SessionActive')
            client++;
        }
    })
    socket.on('Offer',SendOffer)
    socket.on('Answer',SendAnswer)
    socket.on('disconnect',Disconnect)
})

function Disconnect(){
    if(client> 0)
    client--
}

function SendOffer(offer){
    this.broadcast.emit("BackOffer",offer)

}

function SendAnswer(data){
    this.broadcast.emit("BackAnswer",offer)
}

app.listen(port,()=> console.log('Active on ',port))