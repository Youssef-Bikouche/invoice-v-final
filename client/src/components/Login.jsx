import { checkINPUTS } from './utilities/checkINPUT';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faRubleSign } from '@fortawesome/free-solid-svg-icons'
import '../styles/Login.css';
import logo from '../media/logo.mp4';
import avatar from '../media/avatar.png';
import companypic from '../media/company.jpg';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
const Login = () => {
  const [error,seterror]=useState('');
  const [username,setusername]=useState('');
  const [password,setpassword]=useState('');
  const [inputCOLOR,setinputCOLOR]=useState(false);
  const navigate=useNavigate('')
  const handlelogin=async()=>{
    const verify=checkINPUTS(username, password, setinputCOLOR);
    if(verify){
      await axios.post('http://localhost:5000/login',{
        username,
        password,
      }).then(res=>{
        console.log(res)
        if(res.data.message != 'found'){
          seterror(res.data.message);
        }
        else{
          navigate('/Home');
        }
      })
    }
    else{
      seterror('must fill all fields');
    }
    
  }
  return ( 
    <div className="login-container">
        <div className="left-side">
              <video autoPlay loop muted >
                <source src={logo} type="video/mp4"/>
              </video>
        </div>
        <div className="right-side">
        <Link to='/Home'><FontAwesomeIcon icon={faHome} className='Home' /></Link>
            <div action="" className='form'>
              <img src={companypic} alt="user picture" />
              <h1>Welcome back !</h1>
              <label htmlFor="">username :</label>
              <input className={inputCOLOR ? 'inputRED':''} type="text" placeholder='' onChange={(e)=>setusername(e.target.value)}/>
              <label htmlFor="">password :</label>
              <input className={inputCOLOR ? 'inputRED':''} type="password" onChange={(e)=>setpassword(e.target.value)}/>
               <Link to='/Register'>Create an account ?</Link>
               <button onClick={()=>handlelogin()}>Login</button>
               <div className='errorLOGIN'>{error}</div>
            </div>
        </div>
    </div>
    );

}
 
export default Login;