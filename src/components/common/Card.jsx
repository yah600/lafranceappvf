import './Card.css'

function Card({ children, className = '', onClick, style }) {
  return (
    <div
      className={`custom-card ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  )
}

export default Card
