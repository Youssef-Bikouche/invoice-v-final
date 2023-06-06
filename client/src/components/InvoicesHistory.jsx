import React, { useEffect, useState } from 'react';
import '../styles/invoiceHistory.css';
import axios from 'axios';
import moment from 'moment';
import waiting from "../media/loading.gif";
import { checkLogin } from './utilities/checkLogin';
const InvoicesHistory = () => {
  const [invoices, setInvoices] = useState([]);
  const companyName = sessionStorage.getItem('companyName');
  const [verified,setverified]=useState(false);
  const [orderby,setOrderby]=useState("payed");
  const getInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getINVOICES', {
        params: {
          companyName,
          orderby,
        },
      });
      setInvoices(response.data.invoices);
    } catch (error) {
      console.error(error);
    }
  };
  const togglePaymentStatus = async (id,status) => {
    status=!status;
    await axios.put('http://localhost:5000/paymentUPDATE',{
         id,
         status,
    }).then(res=>{
      if(res.data.message){
         getInvoices();
      }
      
    })
  };

  const getStatusButtonColor = (payed) => {
    return payed ? 'green' : 'red';
  };
  const clearHISTORY=async()=>{
    await axios.delete('http://localhost:5000/clearHISTORY',{
      companyName: companyName,
    }).then(res=>{
       if(res.data.message){
        getInvoices();
       }
    })
  }
   const deleteINVOICE=async(id)=>{
      await axios.delete("http://localhost:5000/deleteINVOICE",{
        params :{
          id,
        }
       
      }).then(res=>{
         if(res.data.message){
          getInvoices();
         }
      })
   }
  
   const findINVOICE=async(e)=>{
    let term=e.target.value;
    if(term.length <=0){
      getInvoices();
    }
    await axios.post('http://localhost:5000/searchINVOICE',{
        companyName,
        term,
    }).then(res=>{
      if(res.data.invoices){
        setInvoices(res.data.invoices);
      }
      else{
        getInvoices();
      }
    })
   }
  const handleFILTER=(value)=>{
    setOrderby(value);
  }
  useEffect(() => {
    checkLogin(setverified)
    getInvoices();
  }, [orderby]);
 
  return (<>
  {verified ? (
   <div className="invoice-history-table">
   <table className="invoices-table">
     <thead className="invoices-table-thead">
      <tr className='tr-input-clear'> 
        <th colSpan={1}>
          <select name="" id="" onChange={(e)=>handleFILTER(e.target.value)}>
            <option value="">Order by 🔎</option>
            <option value="payed">Payement status</option>
            <option value="createdAt">creation date</option>
            <option value="receiver">receiver</option>
            <option value="total">Total $</option>
          </select>
        </th>
        <th colSpan={4} className='input-table'><input type="search" placeholder='Search by client name' onChange={(e)=>findINVOICE(e)}/></th>
        <th colSpan={2} className='clear-table'><button className='clear-History' onClick={()=>clearHISTORY()}>Clear History 🗑️</button></th>
      </tr>
       <tr>
         <th>Invoice Number</th>
         <th>Client Name</th>
         <th>Client Phone</th>
         <th>Total</th>
         <th>Created At</th>
         <th>Payment Status</th>
         <th>clear</th>
       </tr>
     </thead>
     <tbody className="invoices-table-tbody">
       {invoices.length > 0 ? (
         invoices.map((invoice, index) => (
           <tr key={invoice.id}>
             <td>{invoice.invoiceNUMBER}</td>
             <td>{invoice.receiver}</td>
             <td>{invoice.receiverPhone}</td>
             <td>{invoice.total}</td>
             <td>{moment(invoice.createdAt).format('DD-MM-YYYY - HH:mm ')}</td>
             <td>
               <button
                 className="status-button"
                 style={{ backgroundColor: getStatusButtonColor(invoice.payed) }}
                 onClick={() => togglePaymentStatus(invoice.id,invoice.payed)}
               >
                 {invoice.payed ? 'Paid' : 'Due'}
               </button>
             </td>
             <td> <span style={{cursor : "pointer"}} onClick={()=>deleteINVOICE(invoice.id)}>🗑️</span></td>
           </tr>
         ))
       ) : (
         <tr>
           <td colSpan={7}>No invoices to show</td>
         </tr>
       )}
     </tbody>
   </table>
 </div>
  ):(<>
      <img style={{ width: "60px" }} className='loading-pic' src={waiting} alt="" />
  </>)}
    
    </>);
};

export default InvoicesHistory;
