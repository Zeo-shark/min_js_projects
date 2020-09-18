const express=require('express')
const app = express()
const Server= require('http').Server(app)
const io= require('socket.io')(Server)

const rooms = { }
app.set('views','./views')
app.set('view engine','ejs')
app.use(express.static('public'))
console.log('server started on port: 3000')
app.use(express.urlencoded({ extended: true}))

app.get('/',(req,res)=>{
    res.render('index',{rooms:rooms})
})

app.post('/room',(req,res)=>{
    if(rooms[req.body.room]!= null){
        return res.redirect('/')
    }
    rooms[req.body.room]={user:{} }
    res.redirect(req.body.room)
    //Send Message new room was created
    io.emit('room-created',req.body.room)
})

app.get('/:room',(req,res)=>{
    if(rooms[req.params.room]==null){
        return res.redirect('/')
    }
    res.render('room',{roomName:req.params.room})
})

Server.listen(3000)
const users={}


io.on('connection',socket=>{

    socket.on('new-user',(room, name)=>{
        socket.join(room)
        rooms[room].user[socket.id] = name
        socket.to(room).broadcast.emit('user-connected',name)
    })
    socket.on('send-chat-message',(room, message) =>{
        socket.to(room).broadcast.emit('chat-message',{message:message, name:
            rooms[room].user[socket.id] })
    })
    socket.on('disconnect',()=>{
        getUserRooms(socket).forEach(room=>{
        socket.to(room).broadcast.emit('user-disconnected', rooms[room].user[socket.id])
        delete rooms[room].user[socket.id] 
        })
    })
})
function getUserRooms(socket){
    return Object.entries(rooms).reduce((names, [name, room])=>{
        if(room.user[socket.id] != null) names.push(name)
        return names
    }, [])
}
