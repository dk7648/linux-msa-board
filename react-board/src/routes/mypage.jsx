import { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ScrapCard from "../components/scrapCard";
function MyPage() {
    let [username, setUsername] = useState();
    let [displayName, setDisplayName] = useState();
    let [authorities, setAuthorities] = useState();
    let [scraps, setScraps] = useState([]);
    const navigate = useNavigate();
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/member/myPage', {
          withCredentials: true
        });
  
        console.log("서버 응답:", response.data);
        // 서버에서 사용자 정보를 보내줄 경우 아래처럼 상태 업데이트 가능
        setUsername(response.data.username);
        setDisplayName(response.data.displayName);
        setAuthorities(response.data.authorities[0].authority)
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error.response?.data || error.message);
        navigate("/")
      }
    };

    const fetchScrapList = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/scrap/me', {
          withCredentials: true
        });
  
        console.log("scrap list : ", response.data);
        // 서버에서 사용자 정보를 보내줄 경우 아래처럼 상태 업데이트 가능
        setScraps(response.data);
      } catch (error) {
        console.error('scrap list 조회 실패:', error.response?.data || error.message);
        navigate("/")
      }
    };

    useEffect(() => {
      fetchUserData();
      fetchScrapList();
    }, []);
    return (
      <div className="container">
        {/* <h4>유저 정보</h4>
        <hr/>
        <p>{username}</p>
        <p>{displayName}</p>
        <p>{authorities}</p>
        <br/><br/> */}
        <h4>나의 Have it 리스트</h4>
        <Container className="card-container">
        <Row>
          {scraps.map((target, i) => {
            return (
              <>
                <ScrapCard key={i} item={target} />
              </>
            );
          })}
        </Row>
      </Container>
        <hr/>
      </div>
    );
}
export default MyPage;