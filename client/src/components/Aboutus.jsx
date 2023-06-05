import React from "react"
import imginvoice from '../media/invoicePDF.jpg'
import about1 from '../media/about1.png'
import about2 from '../media/about2.png'
import about3 from '../media/about3.png'
import '../styles/aboutus.css' 
const Aboutus = ()=>{


    return(
        <>
           <div className="allAbout">
            <div className="containerAbout">
            <div className="imginvoice">
                <img src={imginvoice} alt="" />
               </div>
              <div className="textAbout">
                <div className="text1">
                    <img src={about1} alt="" style={{width:'40px'}}/>
                   <p> We created InvoiceMaster to address the challenges associated with manual invoice generation.</p>
                </div>
                <div className="text2">
                <img src={about2} alt="" style={{width:'40px'}} />
                    <p>With InvoiceMaster, say goodbye to billing errors and save valuable time.</p>
                    </div>
                    <div className="text3">
                    <img src={about3} alt="" style={{width:'40px'}} />
                    <p>Simplify your invoicing with InvoiceMaster and focus on what truly matters: your business.</p>
                    </div>
              </div>
            </div>
              
            </div>     
 
        </>
    )
}


export default  Aboutus;
