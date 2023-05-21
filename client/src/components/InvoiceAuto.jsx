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

const InvoiceAuto = () => {
  const [rows, setRows] = useState([{item: '',unitCost: 0,quantity: '',lineTotal: 0}]); 
  const [subTOTAL,setsubTOTAL]=useState(0);
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'dd/MM/yyyy');
  const navigate = useNavigate("");
  const [verified,setverified]=useState(false);
//************************************************************************************** */
  useEffect(()=>{
    checkLogin(setverified,navigate);
  },[])

//*************************************************************************************** */
const [invoiceNumber,setInvoiceNumber]=useState();
  
//********************************************************************************************** */
  const [clients,setclients]=useState('')
  const [company,setcompany]=useState('') 
  const [products,setproducts]=useState('');

  //********************************************************************************************** */
  const handleLogout=()=>{
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('id')
        navigate('/Home');
  }
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
      const updatedRows = [...rows];
      updatedRows[index] = { ...updatedRows[index], ['unitCost']: e.target.value };
      if(updatedRows[index].quantity !== 0){
        setsubTOTAL(0);
        updatedRows[index].lineTotal= updatedRows[index].unitCost * updatedRows[index].quantity;

        updatedRows.forEach(row=>{
          setsubTOTAL(subTOTAL+ row.lineTotal)
        })  
        
      }
      // caclulTax_Discount()
      setRows(updatedRows);
 }
//*************************************************************************************************** */

const [emailCustomer,setemailCustomer]=useState('');
const [addressCustomer,setaddressCustomer]=useState('');
const [fullName,setFullName]=useState('')
const handleCustomerInfo=(e)=>{
      const SelectedCustomer=(clients.find((client)=>client.fullname === e.target.value));
      console.log(SelectedCustomer)
      setemailCustomer(SelectedCustomer?.email || '');
      setaddressCustomer(SelectedCustomer?.address || '');
      setFullName(SelectedCustomer?.fullname || '');
      console.log(SelectedCustomer)
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
const DownloadPDF=()=>{
     console.log("email customer",emailCustomer);
     console.log("adresse customer",addressCustomer);
     console.log("customer name",fullName)
     console.log("***********************************************")

     console.log("company name",company.name)
     console.log("adresse company",company.address);
     console.log("customer email",company.email)
     console.log("***********************************************")
     console.log("time",formattedDate);
     console.log("number",invoiceNumber)

     console.log("***********************************************")

      rows.forEach(row=>{
        console.log(row.item,row.unitCost,row.quantity,row.lineTotal)
      })

      console.log("***********************************************")
      console.log("subtotal",subTOTAL);
      console.log("tax",Tax)
      console.log("discount",Discount)
      console.log("Total",Total)
}

//*************************************************************************************************** */
  return (<>
  {verified ? 
  (<>
    <div className="all">
    {/* <div className="warning">
      <img className="close" src={remove} alt="" />
       You must fill out all the information
    </div> */}
    <div className="btns-auto">
      <button id="Preview" type="submit"onClick={()=>handleLogout()}>Preview PDF</button>
      <button id="download" type="submit" onClick={()=>DownloadPDF()} >Download PDF</button>
    </div>
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
                           email :<input type="text" value={emailCustomer} disabled/><br />
                           address :<input type="text" placeholder={addressCustomer} disabled />
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
                        <option key={index} value={product.price}>{product.name}</option>
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
  </>)
  :(<>
    <img className="loading-pic" src={loading} alt="" />
  </>)}
  
    </>);
};

export default InvoiceAuto;
