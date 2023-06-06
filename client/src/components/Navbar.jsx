import { checkLogin } from './utilities/checkLogin';
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getCompanyInfo } from './utilities/getCompany';
import axios from 'axios';
import '../styles/Navbar.css'
const Navbar = () => {
        const[ logoCompany , setlogoCompany] = useState();
        const[ companyLogoName , setCompanyLogoName] = useState(sessionStorage.getItem('companyLogo'));
        const[verified,setverified]=useState(false);
     const getLogo = async()=>{
    
         await axios.post('http://localhost:5000/logos',{logoname:companyLogoName})
         .then( res=>{
            setlogoCompany(res.data.imageDataUrl);
         })
         .catch(err=>{
           console.error(err);
         })
     }
     useEffect(() => {
      checkLogin(setverified);
      if(verified){    
      getLogo();
      }
    }, [verified]);


  const navigate=useNavigate();
  const [headerColor, setHeaderColor] = useState('#6060eb3f');

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, []);
  const location = useLocation();
  const currentURL = location.pathname;
  const scroleToServices=()=>{
    if(currentURL==='/Home' || currentURL === '/'){
       const pdfDiv = document.getElementById('ourServices');
       pdfDiv.scrollIntoView({behavior: 'smooth'});
    }
    else{
       navigate('/');
    }
 
 }
   const handleScroll = () => {
        
    if (window.scrollY > 200 || currentURL=='/InvoiceManu' ) { // Changer la couleur à partir de la position de scroll 100px
      setHeaderColor('#6060ebd8'); // Changer la couleur du header
    } else {
      setHeaderColor('#6060eb3f'); // Réinitialiser la couleur du header
    }
  };

  const [loggedIN,setloggedIN]=useState(false);
  const [companyName,setcompanyName]=useState('');
  useEffect(()=>{
    checkLogin(setloggedIN,undefined);
    setcompanyName(sessionStorage.getItem('companyName'));
  })

  const HandleLogout=()=>{
      sessionStorage.removeItem('id');
      sessionStorage.removeItem('companyName');
      sessionStorage.removeItem('token');
      navigate('/Login')

  }
    return ( 
      <div className="Navbar" style={{ backgroundColor: headerColor }}>
            <div className="logo"> 
               <img id="logoImg" src="/images/logoprinc.png"  /> 
            </div>
            <div className="nav"> 
                <ul>
                    <li className=''><Link to="/Home" className='same '>Home</Link> </li>
                    <li className=''><Link to="/Home#ourServices" className='same' onClick={(()=>scroleToServices())}>Services</Link> </li>
                    <li className=''><Link to="/Contact" className='same '>Contact</Link> </li>
                    <li className=''><Link to="/Aboutus" className='same '>About us</Link> </li>
                </ul>
            </div>
            {loggedIN ? (<>
                  <div className='companyName'>
                    <div className='companyLOGONAME'><img className='logocompany' src={logoCompany}  />
                    <div>{companyName}</div> <span style={{fontSize: "small",marginLeft: "4px"}}> ▼ </span></div>
                    
                 
                  <div className='company-options'>
                     <Link to='/invoiceManu'><div>Create Manuel invoice <span>✍🏻</span></div></Link>
                     <Link to='/invoiceAuto'><div>Create Auto invoice <span>🚀</span></div></Link>
                     <Link to='/InvoicesHistory'><div>invoice History <span>📜</span></div></Link>
                     <Link to='/Handleclients'><div>Manage clients <span>🤵</span></div></Link>
                     <Link to='/handleProducts'><div>Manage Products <span>🛒</span></div></Link>
                     <Link to='/settings'><div>Settings <span>⚙️</span></div></Link>
                     <div onClick={()=>HandleLogout()}>logout  <span>⬅</span></div>
                  </div>   
                  </div>
                 
                </>)
                :(<>
                <div className="sign">
                  <Link to="/Login" className='login'> <p>Login</p></Link>
                  <Link to="/Register" className='btnSignUp '><p> Sign up </p> </Link>
                </div>
                </>)}
           
      </div>
     );
  }
   
  export default Navbar;