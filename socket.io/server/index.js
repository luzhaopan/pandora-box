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

let users = [];

// 监听连接
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} 用户已连接!`);
    // 监听和在控制台打印消
    socket.on('message', (data) => {
        console.log(data);
        // 发送信息给到所有在线的用户
        socketIO.emit('messageResponse', data);
    });

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

    // 监听新用户的加入
    socket.on('newUser', (data) => {
        // 添加新用户到 users 中
        users.push(data);
        // console.log(users);
        // 发送用户列表到客户端
        socketIO.emit('newUserResponse', users);
    });

    socket.on('disconnect', () => {
        console.log('🔥: 一个用户已断开连接');
        // 当用户下线的时候更新用户列表
        users = users.filter((user) => user.socketID !== socket.id);
        // console.log(users);
        // 发送用户列表到客户端
        socketIO.emit('newUserResponse', users);
        socket.disconnect();

    });
});
