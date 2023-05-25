import '../styles/Footer.css';
import {Link} from 'react-router-dom'; 

const  Footer = ()=>{

    return(
       <div className="footer-all">
            <div className="logo">
                  <img src="/images/logoprinc.png" width="100px" alt="" />
            </div>
            <div className="differences">
                <div className="contact foot">
                <h3>Contact us</h3>
                   <p>Tel: 0655828059</p>
                   <p>GSM: 8795</p>
                </div>
                <div className="follow foot">
                <h3>Follow us</h3>
                     <img src="/images/instagram.png" alt="" ></img>
                     <img src="/images/facebook.png" alt="" ></img>
                     <img src="/images/twitter.png" alt="" ></img>
                     <img src="/images/snapchat.png" alt="" ></img>
                     <img src="/images/youtube.png" alt="" ></img>
                    </div>
                <div className="about foot">
                <h3>About</h3>
                     <p>About us</p>
                     <p>privacy policy</p>
                     <p>Terms & Conditions</p>
                </div>
                <div className='yourAccount foot'>
                    <h3>Your Account</h3>
                       <p>Login</p>
                       <p>Register</p>
                </div>
            </div>
        <h3 id="cby">© 2023 By INVOICE MASTER</h3>
       </div>
    )
     


}

export default Footer ;