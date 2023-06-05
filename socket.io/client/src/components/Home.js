import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({socket }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', userName);
    // 发送用户名和 socket ID 到 Node.js 服务器
    socket.emit('newUser', { userName, socketID: socket.id });
    navigate('/chat');

  };
  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">登录聊天室</h2>
      <label htmlFor="username">用户名</label>
      <input
        type="text"
        minLength={6}
        name="username"
        id="username"
        className="username__input"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button className="home__cta">登录</button>
    </form>
  );
};

export default Home;
