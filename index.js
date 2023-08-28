const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.static(`${__dirname}/public`))

app.use((request, response, next) => {
    //Define quem poderá acessar a API (* = Todos)
    response.header('Acess-Control-Allow-Origin', '*')
    //Define quais métodos serão utilizados na API
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    //Atribui as permissões ao Cors
    app.use(cors())

    next()
})

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const clients = []

io.on('connection', (client) => {
    console.log(`Client connected ${client.id}`)
    clients.push(client)

    client.on('disconnect', () => {
        clients.splice(clients.indexOf(client), 1)
        console.log(`Client disconnected ${client.id}`)
    })
})

app.get('/test', cors(), (req, res) => {
    res.json({
        "menes": "teste"
    })
})

app.get("/msg", (req, res) => {
    const msg = req.query.msg || ''

    clients.forEach((client) => {
        client.emit('msg', msg)
    })

    res.json({
        'mensagem': msg
    })
})

server.listen(8080, () => console.log('Servidor rodando na porta 8080'))