import { useParams } from "react-router-dom";
import { Nav, Col} from "react-bootstrap";
import { useState, useEffect } from "react";
import habitDatas from "../data/habitDatas.js";
import commentDatas from "../data/commentDatas.js";
import Star from "../components/star.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Scrap() {
  let navigate = useNavigate();
  let [user, setUser] = useState({});

  const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/member/myPage', {
          withCredentials: true
        });
  
        console.log("서버 응답:", response.data);
        // 서버에서 사용자 정보를 보내줄 경우 아래처럼 상태 업데이트 가능
        setUser(response.data);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error.response?.data || error.message);
        navigate("/")
      }
    };

    useEffect(() => {
      fetchUserData();
    }, []);
    
    return (
      <div>
        <h4>스크랩 페이지</h4>
      </div>
    );
}

export default Scrap;
