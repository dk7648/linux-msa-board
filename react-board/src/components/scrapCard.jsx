import { Col, Nav } from "react-bootstrap";
function ScrapCard(props) {
    return (
      <div className="temp">
        <Nav.Link href={"/mypage/scrap/detail/" + props.item.id}>
          <img
            src={"/habit.jpg"}
            width="80%"
          />
          <h4>제목: {props.item.title}</h4>
        </Nav.Link>
        <p>레벨: {props.item.level}</p>
        <p>빈도: {props.item.frequency}</p>
      </div>
    );
  }

  export default ScrapCard;