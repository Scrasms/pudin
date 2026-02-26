import "./Header.css";

function Header({ leftChildren, rightChildren }) {
  let className = "width-full flex ";
  if (!leftChildren && rightChildren) {
    className += "justify-end";
  } else if (leftChildren && !rightChildren) {
    className += "justify-start";
  } else {
    className += "justify-between";
  }

  return (
    <>
      <header className={className}>
        {leftChildren}
        {rightChildren}
      </header>
    </>
  );
}

export default Header;
