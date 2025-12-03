import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Nav, Navbar, Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import habitDatas from "./data/habitDatas";
import noticeDatas from "./data/noticeDatas";
import commentDatas from "./data/commentDatas";
import Main from "./routes/main";
import Detail from "./routes/detail";
import List from "./routes/list";
import Login from "./routes/login";
import Card from 'react-bootstrap/Card';
import "./App.css";
import NavDropdown from 'react-bootstrap/NavDropdown';
import MyPage from "./routes/mypage";
import Register from "./routes/register";
import HabitWrite from "./routes/habitWrite";
import Scrap from "./routes/scrap";
import axios from "axios";
function App() {
  let navigate = useNavigate();
  let [habits] = useState(habitDatas);
  let [notices] = useState(noticeDatas);
  let [comments] = useState(commentDatas);
  let [user, setUser] = useState({});

  const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/member/myPage', {
          withCredentials: true
        });
  
        console.log("user fetch:", response.data);
        // 서버에서 사용자 정보를 보내줄 경우 아래처럼 상태 업데이트 가능
        setUser(response.data);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error.response?.data || error.message);
      }
    };

    useEffect(() => {
      fetchUserData();
      console.log("user : " + user);
    }, []);
    
  return (
    <div className="App">
      <div className="menu-list">
        {user.username ? (
          <>
            <Nav.Link onClick={() => navigate("/mypage")}>
              {user.username}
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/claim")}>문의</Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link onClick={() => navigate("/login")}>로그인</Nav.Link>
            <Nav.Link onClick={() => navigate("/register")}>회원가입</Nav.Link>
          </>
        )}
      </div>
      <div className="temp-img" />
      {/* 로고 + 검색 + 프로필 */}
      <div className="logo-search">
        <div className="logo">
          <Nav.Link onClick={() => navigate("/")}>
            <img src={"/have-it-logo.png"} width="150" />
          </Nav.Link>
        </div>
        <InputGroup className="mb-3 search-container">
          <Form.Control placeholder="검색어를 입력하세요" />
          <Button variant="outline-secondary">검색</Button>
        </InputGroup>
        <div className="profile-menu">
          <Nav.Link
            className="profile-box"
            onClick={() => navigate("/myHabit")}
          >
            <img src={"/heart.png"} width="30" />
            <div>찜</div>
          </Nav.Link>
          <Nav.Link className="profile-box" onClick={() => navigate("/mypage")}>
            <img src={"/user.png"} width="30" />
            <div>내정보</div>
          </Nav.Link>
        </div>
      </div>

      <Navbar>
        <Container>
          <Nav>
            <Nav.Link onClick={() => navigate("/habit/list")}>
              습관 리스트
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/mypage")}>마이 페이지</Nav.Link>
            <Nav.Link onClick={() => navigate("/about")}>메뉴</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      {/* 페이지 라우팅 */}
      <Routes>
        <Route
          path="/"
          element={
            <Main
              comments={comments}
              notices={notices}
              habits={habits}
              navigate={navigate}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/habit/detail/:id" element={<Detail />} />
        <Route path="/habit/list" element={<List />} />
        <Route path="/habit/write" element={<HabitWrite />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/scrap/detail/:id" element={<Scrap />} />
        <Route path="/about" element={<h4>about</h4>} />
        <Route path="*" element={<h4>빈 페이지입니다.</h4>} />
      </Routes>

      <div className="footer-wrapper">
        <div className="footer-line top"></div>
        <div className="footer-line bottom"></div>
        <div className="footer-container">
          <p>2020270755 김범창 프로젝트 학기 Have it</p>
        </div>
      </div>
    </div>
  );
}

export default App
