import '../styles/Settings.css';
import found from "../media/fountain-pen.png";
import group from "../media/group.png";
import pen from "../media/product.png";
import waiting from "../media/loading.gif";
import { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { clearSESSION } from './utilities/clearSESSION';

const Settings = () => {
  const navigate=useNavigate('');
  const id = sessionStorage.getItem('id');
  const [company, setCompany] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateMessage,setupdateMessage]=useState();
  const [verification,setverification]=useState(false);
  const [confirmPASSWORD,setconfirmPASSWORD]=useState('');
  const getDATA = async () => {
    if(id){
    await axios.post('http://localhost:5000/companyInfo', { id })
      .then(res => {
        console.log(res.data.info);
        setIsLoading(false);
        setCompany(res.data.info);
        
      });
    }
  };

  const [countCUSTOMERS, setCountCUSTOMERS] = useState('');
  const [countPRODUCTS, setCountPRODUCTS] = useState('');
  const [countINVOICES, setCountINVOICES] = useState('');

  const countSTATS = async () => {
    if(id){
    await axios.post('http://localhost:5000/countSTATS', { id })
      .then((res) => {
        console.log(res.data);
        setCountCUSTOMERS(res.data.customerCount);
        setCountPRODUCTS(res.data.productCount);
        setCountINVOICES(res.data.invoiceCount);
      });
    }
  };

  const updateINFOS = async () => {
    await axios.post('http://localhost:5000/updateCompanyInfo', {
      id,
      name: company.name, 
      email: company.email, 
      address: company.address, 
      phone: company.phone, 
    })
      .then((res) => {
        console.log(res.data.message);
        setupdateMessage(res.data.message);
          setTimeout(() => {
            setupdateMessage('');
          }, 2000);
      });
  };
   const deleteACCOUNT=async()=>{
    await axios.post('http://localhost:5000/deleteACCOUNT',{
      id,
    }).then(res=>{
      if(res.data.message === 'deleted'){
        navigate('/Home');
      }   
    })
   }
   const verifyPASSWORD=async()=>{
   await axios.post('http://localhost:5000/verifyPASSWORD',{
     id,
     confirmPASSWORD,
   }).then(res=>{
     console.log(res.data.message);
     if(res.data.message === 'correct'){
      setverification(false);
      clearSESSION();
      deleteACCOUNT();
      navigate('/Login');
     }
     else{
      setverification(false);
      setupdateMessage("password does not match");
     }
    
   })
   }
  useEffect(() => {
    getDATA();
    countSTATS();
  }, []);

  return (
    <div className="settings-container">
      
      {isLoading ? (
        <img style={{ width: "60px" }} src={waiting} alt="" />
      ) : (
        <>
          {company ? (
            <div className="company-settings">
              {verification ? (
                 <div className='confirm-delete-account'>
                 <h3>Confirm by Typing your password :</h3> 
                 <input type="text" placeholder='.....' onChange={(e)=>setconfirmPASSWORD(e.target.value)} />
                 <div>
                     <button onClick={()=>verifyPASSWORD()}>confirm</button>
                     <button onClick={()=>setverification(false)}>Back</button>
                 </div>
              </div>
              ):(<></>)}
             
              <h1>Settings </h1>
              <label htmlFor="">Company Name:</label>
              <input type='text' value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
              <label htmlFor="">Company email:</label>
              <input type='text' value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
              <label htmlFor="">Company address:</label>
              <input type='text' value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} />
              <label htmlFor="">Company Phone:</label>
              <input type='text' value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
              <label htmlFor="">Date of creation :</label>
              <input type='text' value={company.createdAt} disabled />
              <label htmlFor="">Last update:</label>
              <input type='text' value={company.updatedAt} disabled />
              <div className='company-stats'>
                <h3 style={{margin: "4px 0"}}>Account Stats</h3>
                <div className='company-stats-pics'>
                  <img src={group} alt="" />
                  <img src={pen} alt="" />
                  <img src={found} alt="" />
                </div>
                <div className='company-stats-numbers'>
                  <h3>customers: {countCUSTOMERS}</h3>
                  <h3>Products: {countPRODUCTS}</h3>
                  <h3>Invoices: {countINVOICES}</h3>
                </div>
              </div>
              
                 <div className='company-settings-options'>
                 <button className='setting-button-delete' onClick={()=>setverification(true)}>Delete account</button>
                 <button className='setting-button-home' onClick={()=>navigate('/Home')}> Home</button>
                 <button onClick={()=>updateINFOS()}>Save changes</button>
               </div>
             
             

              <div className='update-message'>
                  {updateMessage}
              </div>
            </div>
          ) : (
            <>
              no information was found
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Settings;
