const express  = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const Swal = require("sweetalert2");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

PORT = 8080;

/*CONFIGURACIÓN DE HANDLEBARS*/
app.engine("handlebars", handlebars.engine());
/*VIEWS FOLDER*/
app.set("views", __dirname + "/views");
/*SET HANDLEBARS TEMPLATE MANAGER*/
app.set("view engine", "handlebars");
app.use(express.static(__dirname, +"/views"))
/*PUBLIC FILES*/
app.use(express.static(path.join(__dirname, 'public')));
/*ENDPOINT*/
app.get('/', (req, res) => {
    res.render("index.hbs", {title: "Chat con WebSocket"});
})

/*USERS APLICATION*/
const users = {};

/*SOCKET.IO*/
io.on("connection", (socket) => {
    console.log("Un usuario se ha conectado")
    socket.on("newUser", (username) => {
        users[socket.id]=username
        io.emit("userConnected", username)
    })
    socket.on("chatMessage", (message)=>{
        const username = users[socket.id]
         io.emit('message', { username, message })
    })
    socket.on("disconnect", () => {
        const username = users[socket.id]
        delete users[socket.id]
        io.emit("userDisconnected", username)
        console.log("Un usuario se ha desconectado")
    })
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})