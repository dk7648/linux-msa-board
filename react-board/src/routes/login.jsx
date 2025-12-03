import { useState } from "react";
import axios from "axios";
//import { useNavigate } from "react-router-dom";

function Login() {
  //const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginJWT = async () => {
    try {
      const response = await axios.post('http://localhost:9002/users/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // 쿠키를 서버와 함께 자동으로 전송
      });
      console.log('>> log >> ');
      console.log(response);
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
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
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
