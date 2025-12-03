import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginJWT = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/member/login/jwt', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // 쿠키를 서버와 함께 자동으로 전송
      });

      console.log(response.data); // JWT 토큰 또는 응답 메시지 출력

      const jwt = response.data.jwt;
      //document.cookie = `jwt=${jwt}; path=/; max-age=${3600*10}; secure; HttpOnly`;
      console.log('JWT saved in cookie:', jwt);
      window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  

  return (
    <div>
      <input
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={loginJWT}>로그인</button>
    </div>
  );
}
export default Login;
