import { Col, Nav } from "react-bootstrap";
function Card(props) {
    return (
      <div className="temp">
        <Nav.Link href={"/habit/detail/" + props.item.id}>
          <img
            src={"/habit.jpg"}
            width="80%"
          />
          <h4>제목: {props.item.title}</h4>
        </Nav.Link>
        <p>{props.item.difficult}레벨 / 주 {props.item.repeatCount}회</p>
        <p>{props.item.hashtags}</p>
      </div>
    );
  }

  export default Card;