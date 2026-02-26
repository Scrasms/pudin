import Button from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import headerDrip from "../../assets/header_drip.svg";
import "./Home.css";

function Home() {
  const loginBtn = (
    <Button
      className="login"
      children={"Login"}
      onClick={() => console.log("Login!")}
    />
  );
  const signupBtn = (
    <Button
      className="signup"
      children={"Signup"}
      onClick={() => console.log("Signup!")}
    />
  );
  const headerRight = (
    <div>
      {loginBtn}
      {signupBtn}
    </div>
  );

  return (
    <>
      <Header rightChildren={headerRight} />
      <img id="header-img" className="width-full" src={headerDrip} draggable="false"/>
    </>
  );
}

export default Home;
