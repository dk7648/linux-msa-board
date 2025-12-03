import { useParams } from "react-router-dom";
import { Nav, Col} from "react-bootstrap";
import { useState, useEffect } from "react";
import habitDatas from "../data/habitDatas.js";
import Star from "../components/star.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Detail() {
  let navigate = useNavigate();
    let { id } = useParams();
    let [habit, setHabit] = useState(habitDatas);
    let [comments, setComments] = useState([]);

const [content, setContent] = useState('');
const [rating, setRating] = useState(5); // 기본 별점
const [good, setGood] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  const newComment = {
    content: content,
    rate: rating,
    parentId: id, // 게시글 id
  };

  try {
    const response = await axios.post('http://localhost:8080/api/comment/write', newComment, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const savedComment = response.data;
    setComments((prev) => [...prev, savedComment]);
    setContent('');
    setRating(5);
  } catch (err) {
    console.error(err);
    alert('댓글 작성 중 오류가 발생했습니다.');
  }
};

    const fetchHabitsData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/habit/detail/'+id, {
          withCredentials: true
        });
  
        console.log("fetched Habit Data :", response.data);
        // 서버에서 사용자 정보를 보내줄 경우 아래처럼 상태 업데이트 가능
        setHabit(response.data);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error.response?.data || error.message);
      }
    };

    const fetchCommentsData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/habit/detail/'+id+'/comments', {
          withCredentials: true
        });
  
        console.log("fetched comments data:", response.data);
        // 서버에서 사용자 정보를 보내줄 경우 아래처럼 상태 업데이트 가능
        var newComments = [...response.data]
        setComments(newComments);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error.response?.data || error.message);
      }
    };

    const fetchGoodData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/habit/detail/'+id+'/good', {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // 쿠키를 서버와 함께 자동으로 전송
      });
  
        console.log("fetched good data: ", response.data);
        // 서버에서 사용자 정보를 보내줄 경우 아래처럼 상태 업데이트 가능
        setGood(response.data);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error.response?.data || error.message);
      }
    };

    const PostGoodData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/habit/detail/" + id + "/good",
          null,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // 쿠키를 서버와 함께 자동으로 전송
          }
        );

        console.log("서버 응답:", response.data);
        // 서버에서 사용자 정보를 보내줄 경우 아래처럼 상태 업데이트 가능
        setGood(response.data);
      } catch (error) {
        console.error(
          "사용자 정보 조회 실패:",
          error.response?.data || error.message
        );
      }
    };

    const ScrapHabit = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/habit/detail/" + id + "/scrap",
          null,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // 쿠키를 서버와 함께 자동으로 전송
          }
        );

        console.log("scrap response : ", response.data);
        alert("가져오기 완료!")
      } catch (error) {
        console.error(
          "사용자 정보 조회 실패:",
          error.response?.data || error.message
        );
      }
    };

    useEffect(() => {
      fetchHabitsData();
      fetchCommentsData();
      fetchGoodData();
    }, []);

    useEffect(() => {
      console.log(habit);
      console.log(comments);
    }, [habit,comments]);

    useEffect(() => {
      console.log(good);
    }, [good])
    return (
      <div className="container">
        <h4>{habit.title}</h4>
        <hr />

        <p>{habit.content}</p>
        <h4>Have it! 정보</h4>
        <hr />
        <p>레벨: {habit.difficult}</p>
        <p>빈도: {habit.repeatCount}</p>
        <br />
        <br />
        <h4>{habit.hashtags}</h4>
        <div className="menu-list">
          <div onClick={PostGoodData}>
            <img
              src={good ? "/heart-full-line.png" : "/heart-empty.png"}
              width="30"
            />
          </div>
          <div onClick={ScrapHabit}>
            <img src="/copy.png" width="30" />
          </div>
          <Nav.Link onClick={() => navigate("/habit/list")}>목록</Nav.Link>
        </div>

        <h4>댓글</h4>
        <hr />

        <div className="comment-wrapper">
          <div>
            <form className="comment-form-enhanced" onSubmit={handleSubmit}>
              <label htmlFor="comment-text">댓글</label>
              <textarea
                id="comment-text"
                className="comment-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="여기에 댓글을 입력하세요..."
                required
              />

              <div className="comment-actions">
                <div className="rating-box">
                  <label htmlFor="rating">평점</label>
                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="comment-rating-select"
                    required
                  >
                    <option value="5">⭐️⭐️⭐️⭐️⭐️ (5)</option>
                    <option value="4">⭐️⭐️⭐️⭐️ (4)</option>
                    <option value="3">⭐️⭐️⭐️ (3)</option>
                    <option value="2">⭐️⭐️ (2)</option>
                    <option value="1">⭐️ (1)</option>
                  </select>
                </div>

                <button type="submit" className="comment-submit-btn">
                  작성
                </button>
              </div>
            </form>
            <hr />
          </div>
          <div className="comment-wrapper">
            {comments.map((item) => (
              <div className="comment">
                <Star rating={item.rate} />
                <h5>{item.member.username}</h5>
                <p>{item.content}</p>
                <p>{item.created?.substring(0, 10)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}

export default Detail;
