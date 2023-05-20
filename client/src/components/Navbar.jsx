import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Navbar.css'
const Navbar = () => {
  const [headerColor, setHeaderColor] = useState('#6060eb3f');

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
     // window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const location = useLocation();
  const currentURL = location.pathname;
   const handleScroll = () => {
        
    if (window.scrollY > 200 || currentURL=='/InvoiceManu' ) { // Changer la couleur à partir de la position de scroll 100px
      setHeaderColor('#6060ebd8'); // Changer la couleur du header
    } else {
      setHeaderColor('#6060eb3f'); // Réinitialiser la couleur du header
    }
  };
    return ( 
      <div className="Navbar" style={{ backgroundColor: headerColor }}>
            <div className="logo"> 
               <img id="logoImg" src="/images/logoprinc.png"  /> 
            </div>
            <div className="nav"> 
                <ul>
                    <li className=''><Link to="/Home" className='same '>Home</Link> </li>
                    <li className=''><Link to="" className='same '>Services</Link> </li>
                    <li className=''><Link to="" className='same '>Contact</Link> </li>
                    <li className=''><Link to="" className='same '>About us</Link> </li>

                </ul>
            </div>
            <div className="sign">
                <li className=''><Link to="/Login" className='login '>Login</Link> </li>
                <Link to="/Register" > <button className='btnSignUp '> Sign up</button></Link>
            </div>
          
                
        
        
           
      </div>
     );
  }
   
  export default Navbar;
