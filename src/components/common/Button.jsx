import './Button.css'

function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  icon,
  fullWidth = false,
}) {
  const classes = [
    'custom-button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth && 'button-full-width',
    disabled && 'button-disabled',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-text">{children}</span>
    </button>
  )
}

export default Button
