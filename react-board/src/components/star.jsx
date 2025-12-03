
function Star(props) {
    console.log(props.rating)
  return (
    <div className="rating">
      {Array.from({ length: props.rating }, (_, i) => (
        <div key={i} >
          <img
            src={"/yellow_star.png"}
            width="30"
          />
        </div>
      ))}
      {Array.from({ length: 5-props.rating }, (_, i) => (
        <div key={i} >
          <img
            src={"/empty_star.png"}
            width="30"
          />
        </div>
      ))}
    </div>
  );
}

  export default Star;