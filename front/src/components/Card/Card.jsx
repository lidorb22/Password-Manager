import "./Card.css";

/* Centered container for the entire app - acts as the extension popup */
function Card({ children }) {
  return <div className="card">{children}</div>;
}

export default Card;