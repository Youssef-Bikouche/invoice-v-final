import { useEffect, useState } from 'react';
import '../styles/handleClients.css';
import { getClients } from './utilities/getClients';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import loadinggif from '../media/30.gif'
import moment from 'moment'
import deleteIcon from '../media/delete.png';
import editIcon from '../media/draw.png';
import loading from "../media/loading.gif";
import { checkLogin } from "./utilities/checkLogin";
const HandleClients= () => {
  const companyID =sessionStorage.getItem('id');
  const [clients,setClients]=useState([]);
  const [searchClients,setsearchClients]=useState('');
  const [editClicked,setEditClicked]=useState(false);
  const [clientToEdit,setClientToEdit]=useState();
  const [newName,setNewName]=useState();
  const [newEmail,setNewEmail]=useState();
  const [newAddress,setNewAddress]=useState();
  const [newPhone,setNewPhone]=useState();
  const [errorUniqueFullname,setErrorUniqueFullname]=useState(false);
  const [errorUniqueEmail,setErrorUniqueEmail]=useState(false);
  const [errorUniquePhone,setErrorUniquePhone]=useState(false);
  const [inputNameEmpty,setInputNameEmpty] = useState(false);
  const [inputEmailEmpty,setInputEmailEmpty]= useState(false);
  const [inputPhoneEmpty,setInputPhoneEmpty]= useState(false)
  const [verified,setverified]=useState(false);

 // const [errormessageSearch,setErrormessageSearch]=useState(false);
  const navigate = useNavigate("");
  const [isloading,setIsloading] = useState(true);


  /********* */
  useEffect(()=>{
    checkLogin(setverified,navigate);
  },[])
/******** */
  useEffect(()=>{
      getClients(companyID,setClients,setIsloading);
       
   //   console.log('ClientsGETED: ',clients);
  },[])



  const HandleSearchClient=async(term)=>{
    if(term.length > 0){
    try {
        await axios.post("http://localhost:5000/searchClient",{
          term,
          companyID,
        }).then(res=>{
          console.log('res data client',res.data.client)
          if(res.data.client){
            console.log(res.data.client);
            setClients([]);
            setsearchClients(res.data.client);
            
          } 
    })
    } catch (error) {
      console.log(error)
    }
  }
  else{
    setsearchClients('');
    getClients(companyID,setClients,setIsloading);
  }  
 }

 const [popDeleteClient,setpopDeleteClient]=useState(false);
 const [clientID,setClientID]=useState('')
 const handleClosePop=(id)=>{
       setpopDeleteClient(true);
       setClientID(id);

 }
 /**** DELETE PRODUCT **** */
 const DeleteClient=async(id)=>{
     console.log("id client : ",id);
     try {
      await axios.post('http://localhost:5000/deleteClient',{
        id,
      }).then(res=>{
        console.log(res);
        if(res.data.message ==="deleted"){
         
          setpopDeleteClient(false);
          getClients(companyID,setClients,setIsloading);
        }
       
      })
     } catch (error) {
      
     }
    
 }
 /****** */
   const handleName = (e)=>{
       setNewName(e.target.value);
       setErrorUniqueFullname(false);
       if(e.target.value===''){
        setInputNameEmpty(true);
     }
     else{
        setInputNameEmpty(false);
     }
   }
   const handleAddress = (e)=>{
    setNewAddress(e.target.value);
}
const handleEmail = (e)=>{
  setNewEmail(e.target.value);
  setErrorUniqueEmail(false);
  if(e.target.value===''){
    setInputEmailEmpty(true);
 }
 else{
    setInputEmailEmpty(false);
 }
}
const handlePhone = (e)=>{
    setNewPhone(e.target.value);
    setErrorUniquePhone(false)
    if(e.target.value===''){
      setInputPhoneEmpty(true);
   }
   else{
      setInputPhoneEmpty(false);
   }
  }

 /****** */
 const handlePopEdit = (id,name,address,email,phone)=>{
      setEditClicked(true);
      setClientToEdit(id);
      setNewName(name);
      setNewAddress(address);
      setNewEmail(email);
      setNewPhone(phone);
     setErrorUniqueFullname(false);
       setErrorUniqueEmail(false);
    setErrorUniquePhone(false);
    setInputNameEmpty(false);
    setInputEmailEmpty(false);
    setInputPhoneEmpty(false);
 }
 /**/
 const saveClientEdited= ()=>{
      console.log('id client to edit : ',clientToEdit);
        if(newName === "" ){
            setInputNameEmpty(true);
         }
        else if( newEmail === ""){
            setInputEmailEmpty(true);
           }
        else if( newAddress === ""){
          // setInputAddressEmpty(true);
         }
        else if( newPhone === ""){
            setInputPhoneEmpty(true);
         }
         else {

       
      try {
             axios.post('http://localhost:5000/editClient',{id:clientToEdit,newName:newName,
             newEmail:newEmail,newAddress:newAddress,newPhone:newPhone})
             .then(res =>{
                console.log(res.data.message);
                   if(res.data.message === 'updated'){
                    setEditClicked(false);
                    getClients(companyID,setClients,setIsloading);
                    console.log(res.data.message);   
                   }
                   else{
                    console.log(res.data.message[0]);   
                     if(res.data.message[0]==='fullname') setErrorUniqueFullname(true);
                     if(res.data.message[0]==='email') setErrorUniqueEmail(true);
                     if(res.data.message[0]==='phone') setErrorUniquePhone(true);
                   }
             })

      } catch (error) {
           console.log(error);
      }
    }
 }
 /****** */
  return (   <>
    {verified ? (<>  
     <div className="all-handel-client">
        
      <div className="container-table-client">
      {isloading ? (<div id="divIsLoading" > <img id="isloading" src={loadinggif} alt="" /> </div>) : (<>
      
      
        <div className="div-add-client">
             <button className="btn-add-client" onClick={()=>navigate('/NewClient')}>Add new client</button>
        </div>
        <div className="search-client">
              <input onChange={(e)=>HandleSearchClient(e.target.value)} type="text" placeholder='search clients here ...'/>
        </div>
        <div className="table-display-clients">
              <table>
                <thead>
                 <tr>
                  <th>name</th>
                  <th>address</th>
                  <th>email</th>
                  <th>phone</th>
                  <th>Creation Date</th>
                  <th colspan="2">Actions</th>
                  </tr>
                </thead>
               
                {clients?.length > 0 ? 
                clients.map((client) =>(
                  <>
                  <tr>
                    <td>{client.fullname}</td>
                    <td>{client.address}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>{moment(client.createdAt).format('DD-MM-YYYY')}</td>
                    <td> <button onClick={()=>handlePopEdit(client.id,client.fullname,client.address,client.email,client.phone)} className="edit-btn-client"><img src={editIcon} alt="" /></button></td>
                    <td><button className="delete-btn-client" onClick={()=>handleClosePop(client.id)}> <img src={deleteIcon}  alt="" /> </button></td>
                  </tr>
                  </>
                )):(<>
                
                {searchClients?.length > 0 ? 
                searchClients.map((client) =>(
                  <>
                  <tr>
                    <td>{client.fullname}</td>
                    <td>{client.address}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>{moment(client.createdAt).format('DD-MM-YYYY')}</td>
                    <td> <button onClick={()=>handlePopEdit(client.id,client.fullname,client.address,client.email,client.phone)} className="edit-btn-client"><img src={editIcon} alt="" /></button></td>
                    <td><button className="delete-btn-client" onClick={()=>handleClosePop(client.id)}> <img src={deleteIcon}  alt="" /> </button></td>
                  </tr>
                  </>
                )): <tr> <td colSpan={6}><div className='client-message'>no clients was found</div></td></tr>}
                </>)}
                
               
               
         
              </table>
             
        </div>
        </>) }
     </div>
     {editClicked? (<>
            
            <div className="edit-client-pop" >
               <div onClick={()=>{setEditClicked(false)}} className="close-client-pop-edit">
                  X 
               </div>
                  <div className="edit-client-p-text"><p>Edit client :</p></div> 
                  <input value={newName} onChange={ (e)=>handleName(e)} id='name' type="text" placeholder='Name'/>
                  {errorUniqueFullname?<><p className='ErrorMessageUnique'>fullName already exist, change it please...</p></>:<></>}
                  {inputNameEmpty ? <p className='error-empty' >name is empty</p> : null}
                  <input value={newAddress} onChange={ (e)=>handleAddress(e)} id='address' type="text" placeholder='Address'/>
                  <input value={newEmail} onChange={ (e)=>handleEmail(e)} id='email' type="text" placeholder='Email'/><br></br>
                  {errorUniqueEmail?<><p className='ErrorMessageUnique'>Email already exist, change it please...</p></>:<></>}
                  {inputEmailEmpty ? <p className='error-empty' >Email is empty</p> : null}
                  <input value={newPhone} onChange={ (e)=>handlePhone(e)} id='phone' type="text" placeholder='Phone'/><br></br>
                  {errorUniquePhone?<><p className='ErrorMessageUnique'>Phone already exist, change it please...</p></>:<></>}
                  {inputPhoneEmpty ? <p className='error-empty' >Phone number is empty</p> : null}

                 <div className="div-edit-client-btn"><button id="edit-client-btn" onClick={saveClientEdited}>save</button></div> 
            </div>
            
         
         </>):<></>
 
         }
         {popDeleteClient? (<>
        <div className="popDeleteClient">
            <div className="close-pop-delete" onClick={()=>setpopDeleteClient(false)}>X</div>
            <h2>Do you really want to delete it ?</h2>
            <div className="delete-client-options">
                <button onClick={()=>DeleteClient(clientID)}>Yes</button>
                <button onClick={()=>setpopDeleteClient(false)}>No</button>
            </div>
            <div>{Error}</div>
       </div>
      
      </>)
      :(<></>)
      }
     </div>
       </>):<><img className="loading-pic" src={loading} alt="" /> </>}
       </>
  );
  
}
 
export default HandleClients;