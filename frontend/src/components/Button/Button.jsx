import "./Button.css";

function Button({ className, children, onClick }) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
