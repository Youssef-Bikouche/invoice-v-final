import '../styles/NewClient.css';
import backToIcon from '../media/angle-double-left.png';
import axios from 'axios';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
 const NewClient = (props) => {
       const [name , setName]=useState('');
       const [email , setEmail]=useState('');
       const [address , setAddress]=useState('');
       const [phone , setPhone]=useState('');
      // const [errUniqueClient,setErrUniqueClient] = useState(false);
       const [inputNameEmpty,setInputNameEmpty] = useState(false);
       const [inputEmailEmpty,setInputEmailEmpty]= useState(false);
       const [inputPhoneEmpty,setInputPhoneEmpty]= useState(false)
       const [inputAddressEmpty,setInputAddressEmpty]= useState(false);
       const [errorUniqueFullname,setErrorUniqueFullname]=useState(false);
       const [errorUniqueEmail,setErrorUniqueEmail]=useState(false);
       const [errorUniquePhone,setErrorUniquePhone]=useState(false);
       const id=sessionStorage.getItem('id'); 
       const navigate = useNavigate("");

/***FUNCTION ON CHANGE */
   const handleName= (e)=>{
       setName(e.target.value);
       setErrorUniqueFullname(false)
       if(e.target.value===''){
          setInputNameEmpty(true);
       }
       else{
          setInputNameEmpty(false);
       }
   }
   const handleEmail= (e)=>{
     setEmail(e.target.value);
     setErrorUniqueEmail(false);
     if(e.target.value===''){
      setInputEmailEmpty(true);
   }
   else{
      setInputEmailEmpty(false);
   }
 }
 const handleAddress= (e)=>{
     setAddress(e.target.value);
     if(e.target.value===''){
      setInputAddressEmpty(true);
   }
   else{
      setInputAddressEmpty(false);
   }
 }
 const handlePhone= (e)=>{
    setPhone(e.target.value);
    setErrorUniquePhone(false);
    if(e.target.value===''){
      setInputPhoneEmpty(true);
   }
   else{
      setInputPhoneEmpty(false);
   }
}
/** */
   const  addClient= async()=>{
          if(name === "" ){
                setInputNameEmpty(true);
          }
          else if( email === ""){
                setInputEmailEmpty(true);
          }
          else if( address === ""){
                setInputAddressEmpty(true);
          }
          else if( phone === ""){
                 setInputPhoneEmpty(true);
          }
          else{
         await axios.post('http://localhost:5000/addClient',{name:name,email:email,phone:phone,id:id,address:address})
         .then(response =>{
              if(response.data.message==='created'){
                console.log('response message',response.data.message);
                navigate('/HandleClients');
              } 
              if(response.data.message[0]==='fullname') setErrorUniqueFullname(true);
              if(response.data.message[0]==='email') setErrorUniqueEmail(true);
              if(response.data.message[0]==='phone') setErrorUniquePhone(true);
              
         }).catch( err => {
    
          console.error('error',err);
        
         }
             
         
         )
     }
   }



    return(
         <div className="add-client-container">
              <div onClick={()=>navigate('/HandleClients')}className='backtoclient-div'>
                 <img title='back to your clients' className='backtoclient-icon'src={backToIcon} alt="back" />
              </div>
                
                <div className="add-client-form">
                     <div  className='label-input-client '>
                      <label>Name</label>  
                     <input  onChange={(e)=>handleName(e)} placeholder="..."  type="text" name="" id="" />
                     {errorUniqueFullname ? <p className='error-unique' >The name of the client must be unique</p> : null}
                     {inputNameEmpty ? <p className='error-empty' >name field is empty</p> : null}
                     </div>
                     <div className='label-input-client '>
                     <label>Address</label>
                     <input  onChange={(e)=>handleAddress(e)} placeholder="..." type="text" name="" id="" />
                     {inputAddressEmpty ? <p className='error-empty' >Address is empty</p> : null}
                     </div>
                     <div className='label-input-client '>
                     <label>Email</label>
                     <input onChange={(e)=>handleEmail(e)} placeholder="..."  type="text" name="" id="" />
                     {errorUniqueEmail ? <p className='error-unique' >The Email of the client must be unique</p> : null}
                     {inputEmailEmpty ? <p className='error-empty' >Email is empty</p> : null}
                     </div>
                     <div className='label-input-client '>
                     <label>Phone</label>
                     <input onChange={(e)=>handlePhone(e)} placeholder="..."  type="text" name="" id="" />
                     {errorUniquePhone ? <p className='error-unique' >The phone number of the client must be unique</p> : null}
                     {inputPhoneEmpty ? <p className='error-empty' >Phone is empty</p> : null}
                     </div>
                     <div className='add-client-div'>
                        <button  onClick={addClient}>Add</button>
                     </div>
                 
                  
                </div>
         </div>
    )
 }

 export default NewClient;