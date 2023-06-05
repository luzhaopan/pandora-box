//index.js
const express = require('express');
const app = express();
const PORT = 4000;

// 导入 HTTP 和 CORS 库，来让数据能够在客户端和服务端之间传递
const server = require('http').Server(app);
const cors = require('cors');

app.use(cors());

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

// 在浏览器访问 http://localhost:4000/api 的时候，下面的代码会返回一个 JSON 对象
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


// 添加 Socket.io 到项目中去创建一个实时连接
const { Server } = require("socket.io");
// 创建实时连接
const socketIO = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

// 监听连接
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} 用户已连接!`);
    socket.on('disconnect', () => {
        console.log('🔥: 一个用户已断开连接');
    });
});
