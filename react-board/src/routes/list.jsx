import Card from "../components/Card.jsx";
import { Container, Row, Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./slider.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function List() {
  let navigate = useNavigate();
    let [habits, setHabits] = useState([]);
    const fetchHabitsData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/habit/list', {
          withCredentials: true
        });
  
        console.log("서버 응답:", response.data);
        // 서버에서 사용자 정보를 보내줄 경우 아래처럼 상태 업데이트 가능
        var newHabits = [...habits, ...response.data]
        setHabits(newHabits);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error.response?.data || error.message);
      }
    };
    
    useEffect(() => {
      fetchHabitsData();
    }, []);
    useEffect(() => {
      console.log("habits : " + habits)
    }, [habits]);
  return (
    <div>
      <Nav.Link onClick={() => navigate("/habit/write")}>글쓰기</Nav.Link>
      <Container className="card-container">
        <Row>
          {habits.map((target, i) => {
            return (
              <>
                <Card key={i} item={target} />
              </>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default List;
