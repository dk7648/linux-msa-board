import Card from "../components/Card.jsx";
import { Container, Row } from "react-bootstrap";
import "./slider.css"
import { useState, useEffect } from "react";
import axios from "axios";

import Slider from "react-slick";
import Star from "../components/star.jsx";
function Main(props) {

    let [habits, setHabits] = useState([]);
    let [comments, setComments] = useState([]);

    const settings = {
        dots: true, // 원형 네비게이션 표시
        infinite: true, // 무한 슬라이드
        speed: 500, // 슬라이드 이동 속도 (500ms)
        slidesToShow: 3, // 한 번에 보여줄 카드 개수
        slidesToScroll: 1, // 한 번에 스크롤될 카드 개수
        arrows: true, // 좌우 화살표 표시
        nextArrow: <div className="slick-next">➡</div>, // 오른쪽 화살표 커스터마이징
        prevArrow: <div className="slick-prev">⬅</div>, // 왼쪽 화살표 커스터마이징
        responsive: [
          {
            breakpoint: 768, // 화면 크기가 768px 이하일 때
            settings: {
              slidesToShow: 1, // 모바일에서는 한 번에 한 개 카드만
              slidesToScroll: 1
            }
          }
        ]
      };
      


    const fetchHabitsData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/habit/top', {
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
    
    const fetchCommentsData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/comment/top', {
          withCredentials: true
        });
  
        console.log("서버 응답:", response.data);
        // 서버에서 사용자 정보를 보내줄 경우 아래처럼 상태 업데이트 가능
        var newComments = [...comments, ...response.data]
        setComments(newComments);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error.response?.data || error.message);
      }
    };

    useEffect(() => {
      fetchHabitsData();
      fetchCommentsData();
    }, []);

    useEffect(() => {
      console.log(habits);
    }, [habits]);
    useEffect(() => {
      console.log(comments);
    }, [comments]);
  return (
    <div>
      <div className="notice-slider-wrapper">
        <Slider {...settings}>
          {props.notices.map((item) => (
            <div className="notice-card" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="notice-content">
                <h5>{item.title}</h5>
                <p>{item.content}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <h4>최근 추가된 습관들</h4>
      <Container>
        <Row>
          {habits.map((target, i) => {
            return (
              <>
                <Card navigate={props.navigate} key={i} item={target} />
              </>
            );
          })}
        </Row>
      </Container>
      <h4>최근 작성된 후기들</h4>

      <div className="comment-wrapper"> 
        {comments.map((item) => (
          <div className="comment">
            <Star rating={item.rate} />
            <h5>{item.member.username}</h5>
            <p>{item.content}</p>
            <p>{item.created?.substring(0,10)}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Main;
