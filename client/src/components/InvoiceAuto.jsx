import "../styles/InvoiceAuto.css";
import remove from "../media/remove.png";
import loading from "../media/loading.gif";
import { checkLogin } from "./utilities/checkLogin";
import { getClients } from "./utilities/getClients";
import { getPRODUCTS } from "./utilities/getProducts";
import { getCompanyInfo } from "./utilities/getCompany";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import easyinvoice from 'easyinvoice';

const InvoiceAuto = () => {
  const [rows, setRows] = useState([{item: '',unitCost: '',quantity: '',lineTotal: ''}]); 
  const [subTOTAL,setsubTOTAL]=useState(0);
  const [emailSendSucces,setemailSendSucces]=useState(false);
  const [emailnotSend,setemailnotSend]=useState(false);
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'dd/MM/yyyy');
  const navigate = useNavigate("");
  const [verified,setverified]=useState(false);
  const [invoicepdf,setinvoicepdf]=useState('');
  const [currencySelected,setCurrencySelected]=useState('USD');
  const [isLoadingInvoice,setisLoadingInvoice]=useState(false)

//************************************************************************************** */
  useEffect(()=>{
    checkLogin(setverified,navigate);
  },[])

//*************************************************************************************** */
const [invoiceNumber,setInvoiceNumber]=useState('');
  
//********************************************************************************************** */
  const [clients,setclients]=useState('')
  const [company,setcompany]=useState('') 
  const [products,setproducts]=useState('');

  //********************************************************************************************** */
  // const handleLogout=()=>{
  //       sessionStorage.removeItem('token');
  //       sessionStorage.removeItem('id')
  //       navigate('/Home');
  // }
  useEffect(()=>{
    const id=sessionStorage.getItem('id');
        getPRODUCTS(id,setproducts);
        getCompanyInfo(id,setcompany);
        getClients(id,setclients);
  },[])

//********************************************************************************************** */

  const addRow = () => {
    const newRow = {
      item: '',
      unitCost: 0,
      quantity: '',
      lineTotal: 0
    };
    setRows([...rows, newRow]); 
  };

//********************************************************************************************** */
  const deleteRow= (index)=>{
      // console.log(index);
      const updatedRows = [...rows]; //we use it to create a new array that contauns every elements of a previous array as a copy that we can work with 
      setsubTOTAL(subTOTAL - updatedRows[index].lineTotal) 
      updatedRows.splice(index, 1); // in here , we delete from the specified index in the arguments , only 1 element
      // console.log(updatedRows);
      setRows(updatedRows);
    };

//********************************************************************************************** */
    const handleInputChange = (index, field, value) => {
      setsubTOTAL(0);
      let totall=0
      const updatedRows = [...rows];
      updatedRows[index] = { ...updatedRows[index], [field]: value };
      if(updatedRows[index].quantity !== 0){
        updatedRows[index].lineTotal= updatedRows[index].unitCost * updatedRows[index].quantity;
        updatedRows.forEach(row=>{
          totall+=row.lineTotal;
        })
        setsubTOTAL(totall)
        
      }
      setRows(updatedRows);
    };

//********************************************************************************************** */
 const handleProductPrice=(e,index)=>{
   if(e.target.value !== ""){
      const product= JSON.parse( e.target.value);
      const updatedRows = [...rows];
      updatedRows[index] = { ...updatedRows[index], ['unitCost']: product.price };
      updatedRows[index] = { ...updatedRows[index], ['item']: product.name };
      if(updatedRows[index].quantity !== 0){
        setsubTOTAL(0);
        updatedRows[index].lineTotal= updatedRows[index].unitCost * updatedRows[index].quantity;

        updatedRows.forEach(row=>{
          setsubTOTAL(subTOTAL+ row.lineTotal)
        })  
        
      }
      // caclulTax_Discount()
      setRows(updatedRows);
 }}
//*************************************************************************************************** */

const [emailCustomer,setemailCustomer]=useState('');
const [phoneCustomer,setphoneCustomer]=useState('');
const [addressCustomer,setaddressCustomer]=useState('');
const [fullName,setFullName]=useState('')
const handleCustomerInfo=(e)=>{
      const SelectedCustomer=(clients.find((client)=>client.fullname === e.target.value));
      console.log(SelectedCustomer)
      setemailCustomer(SelectedCustomer?.email || '');
      setaddressCustomer(SelectedCustomer?.address || '');
      setFullName(SelectedCustomer?.fullname || '');
      setphoneCustomer(SelectedCustomer?.phone)
      // console.log(SelectedCustomer)
}

//*************************************************************************************************** */
 const [Tax,setTax]=useState(0);
 const [Discount,setDiscount]=useState(0);
 const [Total,setTotal]=useState(0);
 const caclulTax_Discount = () => {
  const  total = (subTOTAL + (subTOTAL * (+Tax / 100)) - (+subTOTAL * (Discount / 100))).toFixed(2);
  return total;
};
const handleTax = (x) => {
  
  setTax(x);
  caclulTax_Discount();
};

// Handling discount input change
const handleDiscount = (x) => { 
  setDiscount(x);
  caclulTax_Discount();
};
useEffect(()=>{
   setTotal(caclulTax_Discount)
},[Tax,Discount,subTOTAL])

//*************************************************************************************************** */
const handleinvoiceHISTORY=async()=>{
   await axios.post('http://localhost:5000/addINVOICE',{
    id: company.id,
    invoiceNumber,
    fullName,
    Total,
    phoneCustomer,
    companyName: company.name,
   }).then(res=>{
    console.log(res.data.message)
   })
} 

const downloadPDF = async (share)=>{
  setisLoadingInvoice(true);
  await axios.post('http://localhost:5000/downloadpdf',
  {items : rows ,cashier: {name: company.name , address: company.address , email: company.email,phone: company.phone,fileLogo: company.fileLogo },   
  client: {name: fullName , address: addressCustomer , email: emailCustomer,phone: phoneCustomer } 
  ,total :Total , numberOfInvoice: invoiceNumber , taxe: Tax , discount: Discount,currency:currencySelected},
  ).then(response =>{
    console.log('res post invoice : ',response);
       setinvoicepdf(response.data.invoice);
       if(share === "share"){
        if(emailCustomer === ''){
          setemailnotSend(true);
          setInterval(() => {
            setemailnotSend(false);
          },2000);
        }
        else{
        try {
          axios.post('http://localhost:5000/sendbyEMAIL',{
            email: emailCustomer,
            }).then(res=>
            console.log(res));
            setemailSendSucces(true);
            setInterval(() => {
              setemailSendSucces(false);
            },2000);
        } catch (error) {
          setemailnotSend(true);
          setInterval(() => {
            setemailnotSend(false);
          },2000);
        }
      }
       }
       else{
        easyinvoice.download('Invoice N°'+invoiceNumber, response.data.invoice);
       }
      
        if(response.data.invoice){
        
        console.log('Email sent successfully');
        handleinvoiceHISTORY();
       }
       setisLoadingInvoice(false);
       
      
  })
  .catch(err=>{
     console.error(err);
  }) 
 }
 const previewPDF = async ()=>{
  setisLoadingInvoice(true); 
  await axios.post('http://localhost:5000/downloadPDF',
  {items : rows ,cashier: {name: company.name , address: company.address , email: company.email,phone: company.phone,fileLogo: company.fileLogo},   
  client: {name: fullName , address: addressCustomer , email: emailCustomer,phone: phoneCustomer } 
  ,total :Total , numberOfInvoice: invoiceNumber , taxe: Tax , discount: Discount,currency:currencySelected})

  .then( async response =>{
    console.log('res post invoice : ',response);
       setinvoicepdf(response.data.invoice);
       console.log(response.data.invoice);

       easyinvoice.render('pdf', response.data.invoice);
       setisLoadingInvoice(false);
       const pdfDiv = document.getElementById('pdf');
       pdfDiv.scrollIntoView({behavior: 'smooth'});
                       
  })
  .catch(err=>{
     console.error(err);
  })     
 }
 const handleSelectCurrency=(e)=>{
  setCurrencySelected(e.target.value);
 }

//*************************************************************************************************** */
  return (<>
  {verified ? 
  (<>
    <div className="container-invoice-auto">
       
    <div className="btns-auto">
        <button id="Preview" type="submit"onClick={()=>previewPDF()}>Preview PDF</button>
        <button id="download" type="submit" onClick={()=>downloadPDF()} >Download PDF</button>
        <div className="divsendbuttonandmessage">
        <button id="download" type="submit" onClick={()=>downloadPDF("share")} >Send via email</button>
        {emailSendSucces?<><div className="sendEmail"> <p>sent successfully ✅</p> </div></>:<></>}
        {emailnotSend?<><div className="sendEmail failedd"> <p>failed to send ❌</p> </div></>:<></>}
        </div>
      </div>
      {isLoadingInvoice?<>
        <div className="loadingInvoice">
        <img src={loading} alt="Loading" />
        <h3>We are processing your invoice , wait few seconds ...</h3>
      </div>
      </>:<>{null}</>}
      
    <div className="invoice">
      <div className="general-info">
        <p>Creation date: <span id="creationDate">{formattedDate}</span></p>
        <span>
          <label>Invoice number:</label>
          <input type="number" onChange={(e)=>setInvoiceNumber(e.target.value)} />
        </span>
      </div>
      <div id="hrone">
        <hr />
      </div>
      <div className="invoice-info">
        <div className="invoice-titre">
          <h3>Invoice N°: <span className="invoiceNUMBER">{invoiceNumber}</span></h3>
        </div>
        <div className="info-person">
          <div className="info-cashier">
            <p>Company</p>
            {company? (<>
                  
                     Name    :<input type="text" value={company.name} disabled/><br />
                     email   :<input type="text" value={company.email} disabled/><br />
                     address :<input type="text" value={company.address} disabled />
                     phone   :<input type="text" value={company.phone} disabled />
                  
            </>):(<>
            <input type="text" placeholder="cashier name" id="cashier-name" /><br />
            <input type="text" placeholder="cashier email" id="cashier-email" /><br />
            <input type="text" placeholder="cashier address" id="cashier-address" />
            </>)}
            
          </div>
          <div className="info-client">
            <p>Client</p>
            {clients ? (<>
                   Name :<select name="" id="" onChange={(e)=>handleCustomerInfo(e)}>
                    <option id='customer-option' value="">select a customer</option>
                      {clients.map((client,index)=>(
                        <option key={index} value={client.fullname}>{client.fullname}</option>
                      ))}
                   </select>
                           email   :<input type="text" value={emailCustomer} disabled/><br />
                           address :<input type="text" placeholder={addressCustomer} disabled />
                           phone   :<input type="text" placeholder={phoneCustomer} disabled />
            </>)
            :(<>
                  Name    :<input type="text" placeholder="client name" id="client-name" /><br />
                  email   :<input type="text" placeholder="client email" id="client-email" /><br />
                  address :<input type="text" placeholder="client address" id="client-address" />
             </>)}
            
          </div>
        </div>
      </div>
      <div className="invoice-items">
        <table id="table-items">
          <thead>
            <tr id="tr-head">
              <th>Item</th>
              <th>Unit cost</th>
              <th>Quantity</th>
              <th>Line total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {rows.map((row, index) => (
              <tr key={index}>
                <td id="item">
                  {products? (<>
                   <select name="" id="" onChange={(e)=>handleProductPrice(e,index)}>
                    <option value="">select a product</option>
                      {products.map((product,index)=>(
                        <option key={index}  value={JSON.stringify(product)}>{product.name}</option>
                      ))}
                   </select>
                  </>):(<><input
                    type="text"
                    value={row.item}
                    onChange={(e) => handleInputChange(index, 'item', e.target.value)}
                  /></>)}
                </td>
                <td id="unitCost">
                  <input
                    type="number"
                    value={row.unitCost}
                    onChange={(e) => handleInputChange(index, 'unitCost', e.target.value)}
                    disabled
                  />
                </td>
                <td id="quantity">
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                  />
                </td>
                <td id="lineTotal">
                  <input type="number" disabled="disabled" value={row.lineTotal} />
                </td>
                <td id="remove">
                  <button onClick={() => deleteRow(index)}>
                    <img src={remove} alt="" style={{ width: '10px' }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button id="addRow" type="submit" onClick={() =>addRow()}>Add Row</button>
      </div>

        <div className="total">
        <div className="devise">
             <select id="selectdevise" name="selectdevise" onChange={handleSelectCurrency}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="MAD">MAD</option>
                <option value="DZD">DZD</option>
                <option value="TND">TND</option>
                <option value="SAR">SAR</option>
                <option value="USN">USN</option>
             </select>
             </div>

             <div className="inputst">
              Sub Total: <input type="number" placeholder="Subtotal" value={subTOTAL} disabled/><br />
              Tax: <input type="number" placeholder="%" value={Tax} onChange={(e)=>handleTax(e.target.value)}/><br />
              Discount: <input type="number" placeholder="%" value={Discount} onChange={(e)=>handleDiscount(e.target.value)}/><br/>
              Total to pay:
                <input
                  type="number"
                  value={Total}
                  placeholder={Total}
                  disabled
                />
             </div>
             
        </div>
      </div>
      <div className="invoice-preview-p">this is your invoice: ▼ ▼ ▼</div>
         <div id="pdf"></div>
    </div>
  </>)
  :(<>
    <img className="loading-pic" src={loading} alt="" />
  </>)}
  
    </>);
};

export default InvoiceAuto;
