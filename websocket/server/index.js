
const Websocket = require('ws')

const server = new Websocket.Server({port: 8000})

const handleOpen = () => {
    console.log('Websocketopen');
}

const handleClose = () => {
    console.log('Websocketclose');
}

const handleError = () => {
    console.log('Websocketerror');
}

const handleConnection = (ws) => {
    console.log('Websocket Connection');
    ws.on('message', handleMessage)
}

// 获取所有当前所有的客户端并广播消息
const handleMessage = (msg) => {
    server.clients.forEach(c=>{
        c.send(msg)
    })
}

const bindEvent = () => {
    server.on('open', handleOpen, false)
    server.on('close', handleClose, false)
    server.on('error', handleError, false)
    server.on('connection', handleConnection, false)
}

const run = () => {
    bindEvent()
    console.log('websocket server running');
}

run()