import '../styles/Home.css';
import {Link} from 'react-router-dom'; 
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from "./utilities/checkLogin";


const Home = () => {
  const [verified,setverified]=useState('');
  const navigate=useNavigate();

  const CheckLoginStatus=()=>{
    checkLogin(setverified);
  }
  useEffect(()=>{
    checkLogin(setverified,undefined);
  })
  return ( 
    <div className="homepage">
      <section id="section1">
        <img id="backhome" src="/images/backhome.jpg" alt="" srcset="" />
        <div id="parts"> 
        <div className="partleft">
          <div id="centretitres">
      <h1 id="titre">Generate your invoices <span id="auto">Automatically</span> </h1>
        <h1 id="titre2">Save your <span id="time">time</span>, earn your <span id="money">money</span> </h1>      
        <h1 id="getstarted"> 
       <Link id="started" to='/InvoiceManu'>Get started</Link></h1>
       </div>
      </div>
    
        </div>
     
      
       </section>

       <section id="section2">
            <h1 id='ourServices'>Our Services</h1>
            <div className="boxes">
            <div className=" box box1">
             <h3>Manual invoice</h3> 
             <div id="divmanully" className='centerimg'>
             <img src="/images/manully.jpg" width="150px"/>
             </div>
             <Link className="btnLink" to ="/InvoiceManu"> <button onClick={()=>CheckLoginStatus()}> Try it now</button></Link> 
            </div>
            <div className=" box box2">
            <h3>Automatic invoice</h3>
            <div className='centerimg'>
            <img src="/images/automatic.jpg" width="150px"/>
              </div> 
              {verified ? <>
                <Link className="btnLink" to ="/InvoiceAuto"><button>Try it now</button></Link>
              </>:<>
              <Link className="btnLink" to ="/login"><button>Try it now</button></Link>
              </>}
              

            </div>
            <div className=" box box3">
              <div className="box3-titres">
              <h3>Customer Management</h3> 
              <h3>&</h3>
              <h3>Product Management</h3> 
              </div>
              <div className='centerimg'>
              <img src="/images/management2.jpg" width="160px" height="150px"/>
              </div>
              
              {verified ? <>
                <Link className="btnLink" to ="/HandleClients"><button>Try it now</button></Link>
              </>:<>
              <Link className="btnLink" to ="/Login"><button>Try it now</button></Link> 
              </>}
            </div>
            </div>
       </section>
       
    </div>
  
    
   );
}
 
export default Home;