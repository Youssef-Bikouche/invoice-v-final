import "../styles/Login.css";
import logo from "../media/logo.mp4";
import companypic from "../media/company.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkINPUTS } from "./utilities/checkINPUT";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import CryptoJS from "crypto-js";

const Login = () => {
  const [error, seterror] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [inputCOLOR, setinputCOLOR] = useState(false);
  const navigate = useNavigate("");
  const handlelogin = async () => {
    const verify = checkINPUTS(username, password, setinputCOLOR);
    if (verify) {
      await axios.post("http://localhost:5000/login", {
          username,
          password,
        })
        .then(res => {
          if(res.data.message === "found") {
            const CryptingKey = "xxx";
            const token='verified';
            const encryptedValue = CryptoJS.AES.encrypt(token,CryptingKey).toString();
            sessionStorage.setItem('token',encryptedValue);
            sessionStorage.setItem('id',res.data.id);
            sessionStorage.setItem('companyName',res.data.username);
            sessionStorage.setItem('companyLogo',res.data.fileLogo)
            navigate("/InvoiceAuto",{state : {id : res.data.id}});
          } else {
            seterror(res.data.message);
          
          }
        });
    } else {
      seterror("must fill all fields");
    }
  };
  return (
    <div className="login-container">
      <div className="left-side">
        <video autoPlay loop muted>
          <source src={logo} type="video/mp4" />
        </video>
      </div>
      <div className="right-side">
        <Link to="/Home">
          <FontAwesomeIcon icon={faHome} className="Home" />
        </Link>
        <div action="" className="form">
          <img src={companypic} alt="company" />
          <h1>Welcome back !</h1>
          <label htmlFor="">username :</label>
          <input
            className={inputCOLOR ? "inputRED" : ""}
            type="text"
            placeholder=""
            onChange={(e) => setusername(e.target.value)}
          />
          <label htmlFor="">password :</label>
          <input
            className={inputCOLOR ? "inputRED" : ""}
            type="password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <Link to="/Register">Create an account ?</Link>
          <button onClick={() => handlelogin()}>Login</button>
          <div className="errorLOGIN">{error}</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
