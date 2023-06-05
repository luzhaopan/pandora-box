import React, { useState, useEffect } from 'react';

const ChatBar = ({ socket }) => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        socket.on('newUserResponse', (data) => setUsers(data));
    }, [socket, users]);

    const createChat = (e, cur) => {
        e.preventDefault();
        const info = {
            sendUser: localStorage.getItem('userName'), // 发送者name
            receiveInfo: cur, 
            userName: localStorage.getItem('userName'), // 发送者用户名
        }
        socket.emit('curChatInfo', info);
    };
    
    return (
        <div className="chat__sidebar">
        <h2>用户列表</h2>

        <div>
            <h4 className="chat__header">在线用户</h4>
            <div className="chat__users">
                {users.map((user) => (
                    localStorage.getItem('userName') !== user.userName && <p key={user.socketID} onClick={(e) => createChat(e, user)}>{user.userName}</p>
                ))}
            </div>
        </div>
        </div>
    );
};

export default ChatBar;
