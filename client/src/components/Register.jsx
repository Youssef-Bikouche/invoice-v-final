import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import logo from "../media/logo.mp4";
import companypic from "../media/company.jpg";
import "../styles/Register.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [companyName, setcompanyName] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [address, setaddress] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [error, seterror] = useState("");
  const navigate=useNavigate('');
  const handleSubmit = async () => {
    if (
      companyName.length <= 0 ||
      email.length <= 0 ||
      phone.length <= 0 ||
      address.length <= 0 ||
      password.length <= 0
    ) {
      seterror("Must fill all the fields");
    } else {
      if (password.length <= 4) {
        seterror("password is too short , try again");
      } else {
        if (password === confirmpassword) {
          await axios
            .post("http://localhost:5000/addCompany", {
              companyName,
              email,
              phone,
              address,
              password,
            })
            .then((res) => {
              seterror(res.data.message);
              if(res.data.created){
                navigate('/Login');
              }
              
            });
        } else {
          seterror("Password doesnt match");
        }
      }
    }
  };

  return (
    <div className="Register-container">
      <div className="left-side">
        <video autoPlay loop muted>
          <source src={logo} type="video/mp4" />
        </video>
      </div>
      <div className="right-side">
        <FontAwesomeIcon icon={faHome} className="Home" />
        <div action="" className="form">
          <img src={companypic} alt="company" />
          <h1>Welcome !</h1>
          <div className="nom">
            <div className="inputIcon">Company name:</div>
            <div className="input">
              <input
                type="text"
                placeholder="Must be unique"
                onChange={(e) => setcompanyName(e.target.value)}
              />
            </div>
          </div>
          <div className="email">
            <div className="inputIcon">Email</div>
            <div className="input">
              <input
                type="text"
                placeholder="Exemple@gmail.com"
                onChange={(e) => setemail(e.target.value)}
              />
            </div>
          </div>
          <div className="phone">
            <div className="inputIcon">Phone</div>
            <div className="input">
              <input type="text" onChange={(e) => setphone(e.target.value)} />
            </div>
          </div>
          <div className="address">
            <div className="inputIcon">Address</div>
            <div className="input">
              <input type="text" onChange={(e) => setaddress(e.target.value)} />
            </div>
          </div>
          <div className="passwordd">
            <div className="inputIcon">Password</div>
            <div className="input">
              <input
                type="password"
                placeholder="Must have at least 5 characters"
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>
          </div>
          <div className="cpasswordd">
            <div className="inputIcon">Confirm Password</div>
            <div className="input">
              <input
                type="password"
                onChange={(e) => setconfirmpassword(e.target.value)}
              />
            </div>
          </div>
          <button onClick={() => handleSubmit()}>Submit</button>
          <div className="errorLOGIN">{error}</div>
        </div>
      </div>
    </div>
  );
};

export default Register;
