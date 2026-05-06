import "./ProgressDots.css";

/* Progress indicator for multi-step flows (registration) */
function ProgressDots({ total, current }) {
  const dots = [];
  
  /* Build array of dots based on total count */
  for (let i = 1; i <= total; i++) {
    const isActive = i <= current;
    dots.push(
      <div
        key={i}
        className={`progress-dot${isActive ? " progress-dot-active" : ""}`}
      />
    );
  }

  return <div className="progress-dots">{dots}</div>;
}

export default ProgressDots;