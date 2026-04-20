import './Button.css';

export default function Button({
  children,
  type = 'button',
  disabled = false,
  onClick,
  className,
  ...rest
}) {
  const combined = ['common-btn', className].filter(Boolean).join(' ');
  return (
    <button
      type={type}
      className={combined}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
