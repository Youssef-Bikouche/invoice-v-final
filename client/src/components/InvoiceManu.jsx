import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "../styles/InvoiceManu.css";
import axios from 'axios';
import easyinvoice from 'easyinvoice';

const InvoiceManu = () => {
   const [rows, setRows] = useState([{item:'' , unitCost:'' , quantity:'' , lineTotal:''}]);
   const [inputSubtotalValue,setInputSubtotalValue] = useState();
   const [inputTaxeValue,setInputTaxeValue] = useState(0);
   const [inputDiscountValue,setInputDiscountValue] = useState(0);
   const [inputTOTALValue,setInputTOTALValue] = useState(0);
   const [numberOfInvoice,setNumberOfInvoice] = useState('');
   const [clientName , setClientName] = useState(''); 
   const [clientEmail , setClientEmail] = useState(''); 
   const [clientAddress , setClientAddress] = useState(''); 
   const [cashierName , setCashierName] = useState(''); 
   const [cashierEmail , setCashierEmail] = useState(''); 
   const [cashierAddress , setCashierAddress] = useState('');
   const [invoicepdf , setinvoicepdf] = useState('');
   const [currencySelected , setCurrencySelected] = useState('');
   const [cashierPhone,setCashierPhone] = useState('');
   const [clientPhone,setClientPhone]=useState('');
   const handleAddRow = () => {
      // Clone the last row
      const lastRow = rows[rows.length - 1];
      const newRow = { ...lastRow };
      // Clear the input values in the new row
      newRow.item = '';
      newRow.unitCost = '';
      newRow.quantity = '';
      newRow.lineTotal = '';
      // Add the new row to the state
      setRows(prevRows => [...prevRows, newRow]);
   };

   const handleDeleteRow = (index) => {
     console.log(index);
      const updatedRows = [...rows]; // Create a copy of the rows array
       updatedRows.splice(index, 1); // Remove the row at the specified index
       setRows(updatedRows); // Update the state with the modified rows array
       console.log('updater.lenght = ',updatedRows.length)
       console.log('rows.lenght = ',rows.length)
         if(updatedRows.length != rows.length){
            claqsubtotal(updatedRows);
         }
   }

   const handleChange = (e, index) => {
      const { name, value } = e.target;
      // Update the input value in the corresponding row
      setRows(prevRows => {
         const updatedRows = [...prevRows];
         updatedRows[index][name] = value;
         return updatedRows;
      });
      calqLineTotal(e,index);
      claqsubtotal();

   
   }

    const calqLineTotal = (e,index)=>{
       if(e.target.name=='unitCost'){
         rows[index]['lineTotal'] = (parseFloat(e.target.value) * parseFloat(rows[index]['quantity']));
        }
        if(e.target.name=='quantity'){
         rows[index]['lineTotal'] = (parseFloat(e.target.value) * parseFloat(rows[index]['unitCost']));

        }
    }
     const claqsubtotal=(updatedRows)=>{
      let total = 0;
      if(updatedRows){
         updatedRows.map(row=>{
            if( !isNaN( parseFloat(row['lineTotal']) )){
               console.log('row==',row['lineTotal']);
               total += parseFloat(row['lineTotal']);
            }
               
          })
      } else{
         rows.map(row=>{
            if( !isNaN( parseFloat(row['lineTotal']) )){
               console.log('row==',row['lineTotal']);
               total += parseFloat(row['lineTotal']);
            }
               
          })
      }
          
          setInputSubtotalValue(total);
          // pour fixer le probleme de mis a jour de total lorsque je change subtotal
          setInputTOTALValue( ( total + ( total*(+inputTaxeValue / 100)) - (  total*(+inputDiscountValue/ 100) )).toFixed(2))

         
     }
     const calqTOTAL=(e)=>{
       if(e.target['name']=='taxe'){
         setInputTaxeValue(e.target['value']);
         setInputTOTALValue( (inputSubtotalValue + (inputSubtotalValue*(+e.target['value'] / 100)) - ( inputSubtotalValue*(+inputDiscountValue / 100) )).toFixed(2))

       }
       else if(e.target['name']=='discount'){
         setInputDiscountValue ( e.target['value']);
         setInputTOTALValue( (inputSubtotalValue + (inputSubtotalValue*(+inputTaxeValue / 100)) - ( inputSubtotalValue*(+e.target['value'] / 100) )).toFixed(2))

       }

      console.log( 'name ::  ',e.target['name'])

   } 
     const getCurrentDate=()=>{
           let date=new Date();
           //+1 cuz of the 0 based index of months in the object
           let currentDATE=`${date.getDate()} / ${date.getMonth() +1} / ${date.getFullYear()}`;
           return currentDATE ;
     }
     const getNumberOfInvoice = (e)=>{
           setNumberOfInvoice(e.target.value);
     }

     /** */
     const handleSelectCurrency=(e)=>{
      setCurrencySelected(e.target.value);
    
     }
  const saveNameClient=(e)=>{
      setClientName(e.target.value);

  }
  const saveAddressClient=(e)=>{
   setClientAddress(e.target.value);
  
}
  const saveEmailClient=(e)=>{
   setClientEmail(e.target.value);
  }
  const saveNameCashier=(e)=>{
   setCashierName(e.target.value);

}
const saveAddressCashier=(e)=>{
setCashierAddress(e.target.value);

}
const saveEmailCashier=(e)=>{
setCashierEmail(e.target.value);

}
 const savePhoneCashier = (e)=>{
     setCashierPhone(e.target.value);
 }
 const savePhoneClient =(e)=>{
     setClientPhone(e.target.value);
 }

     /*** */
  
       const downloadPDF = async (share)=>{
        await axios.post('http://localhost:5000/downloadpdf',
        {items : rows ,cashier: {name: cashierName , address: cashierAddress , email: cashierEmail , phone:cashierPhone },   
        client: {name: clientName , address: clientAddress , email: clientEmail, phone:clientPhone } 
        ,total :inputTOTALValue , numberOfInvoice: numberOfInvoice , taxe: inputTaxeValue ,
         discount: inputDiscountValue, currency:currencySelected  })

        .then(response =>{
          console.log('res post invoice : ',response);
             setinvoicepdf(response.data.invoice);
             console.log(response.data.invoice);
             if(share === "share"){
               axios.post('http://localhost:5000/sendbyEMAIL',{
                 email: clientEmail,
             }).then(res=>
             console.log(res))
          }
          else{
           easyinvoice.download('Invoice N°'+numberOfInvoice, response.data.invoice);
          }
        })
        .catch(err=>{
           console.error(err);
        })     
       }

       const previewPDF = async ()=>{
         await axios.post('http://localhost:5000/downloadPDF',
         {items : rows ,cashier: {name: cashierName , address: cashierAddress , email: cashierEmail, phone:cashierPhone },   
         client: {name: clientName , address: clientAddress , email: clientEmail ,phone:clientPhone } 
         ,total :inputTOTALValue , numberOfInvoice: numberOfInvoice , taxe: inputTaxeValue ,
          discount: inputDiscountValue, currency:currencySelected })
 
         .then( async response =>{
           console.log('res post invoice : ',response);
              setinvoicepdf(response.data.invoice);
              console.log(response.data.invoice);
             // const result = await easyinvoice.createInvoice(data);
              easyinvoice.render('pdf', response.data.invoice);
                              
         })
         .catch(err=>{
            console.error(err);
         })     
        }

   return (
      <div className="container">
         <div className="btns">
            {/* <button id="sendEmail" type="submit">Send Email</button> */}
            <Link to='#pdf'><button type="submit" onClick={previewPDF} >View PDF</button></Link>
            <button id="download" type="submit" onClick={downloadPDF} >Download PDF</button>
            {/* <button id="download" type="submit" onClick={()=>downloadPDF("share")} >Send via email</button> */}
         </div>
         <div className="invoice">
            <div className="general-info">
               <p>Creation date :  {getCurrentDate()}  </p>
               <span>
                  <label>Invoice number:</label>
                  <input type="number" id="inv-nbr" onChange={(e)=>getNumberOfInvoice(e)}></input>
               </span>
            </div>
            <div id="hrone"><hr></hr></div>
            <div className="invoice-info">
               <div className="invoice-titre">
                  <h3>Invoice N°: {numberOfInvoice}</h3>
               </div>
               <div className="info-person">
                  <div className="info-cashier">
                     <p>Cashier</p>
                     <input onChange={saveNameCashier} type="text" placeholder="cashier name" id="cashier-name"></input><br></br>
                     <input onChange={saveEmailCashier} type="text" placeholder="cashier email" id="cashier-email"></input> <br></br>
                     <input onChange={saveAddressCashier} type="text" placeholder="cashier address" id="cashier-address"></input>
                     <input onChange={savePhoneCashier} type="text" placeholder="cashier phone" id="cashier-phone"></input>

                  </div>
                  <div className="info-client">
                     <p>Client</p>
                     <input onChange={saveNameClient} type="text" placeholder="client name" id="client-name"></input> <br></br>
                     <input onChange={saveEmailClient} type="text" placeholder="client email" id="client-email"></input><br></br>
                     <input onChange={saveAddressClient} type="text" placeholder="client address" id="client-address"></input>
                     <input onChange={savePhoneClient} type="text" placeholder="client phone" id="client-phone"></input>

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
                           <td id="item" >
                              <input name="item" value={row.item} onChange={e => handleChange(e, index)} id="inputItem" type="text"></input>
                           </td>
                           <td id="unitCost">
                              <input name="unitCost" value={row.unitCost} onChange={e => handleChange(e, index)} id="inpuUnitCost" type="number"></input>
                           </td>
                           <td id="quantity">
                              <input name="quantity" value={row.quantity} onChange={e => handleChange(e, index)} id="inputQuantity" type="number"></input>
                           </td>
                           <td id="lineTotal">
                              <input name="lineTotal" value={row.lineTotal?row.lineTotal:0} onChange={e => handleChange(e, index)} id="inputLineTotal" type="number" disabled="disabled" ></input>
                           </td>
                           <td id="remove">
                              <button id="deleteRow" onClick={()=>handleDeleteRow(index)} > <img src="/images/remove-icone.png" alt="" width='10px' ></img> </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
               <button id="addRow" type="submit" onClick={handleAddRow}>Add Row</button>
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
               <p>Subtotal</p><input  name='subtotal'  type="number" onInput={(e)=>calqTOTAL(e)}  value={inputSubtotalValue}  placeholder="Subtotal" id="subtotal" disabled></input> <br></br>
               <p>Taxe</p><input name='taxe' type="number" onChange={(e)=>calqTOTAL(e)}  value={inputTaxeValue}  placeholder="Taxes" id="tax"></input><br></br>
               <p>Discount</p> <input name='discount' type="number" onChange={(e)=>calqTOTAL(e)} value={inputDiscountValue}  placeholder="Discount" id="discount"></input> <br></br>
               <p>Total</p>  <input  type="number"  value={inputTOTALValue}  placeholder="Total" id="total" disabled="disabled"></input>
            </div>
            
            </div>
           
         </div>
         <div className="invoice-preview-p">this is your invoice:</div>
         <div id="pdf"></div>
      </div>
   )

}

export default InvoiceManu;