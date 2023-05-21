


  const express = require('express');
 const app = express();
  const cors = require('cors');
  const easyinvoice = require('easyinvoice');
  var fs = require('fs');
  app.use(express.json());
  app.use(cors()); // Enable CORS for all routes

  app.get('/', (req,res)=>{
     res.send('hhhhhhhhhhhhh');

  })
  app.post('/InvoiceManu/downloadpdf', (req,res)=>{
    let {items} =  req.body;     
    let {total} =  req.body;
    let {taxe} =  req.body;
    let {client} = req.body;
    let {cashier} = req.body;
    let {discount} = req.body;
    let {currency} = req.body;
    let {numberOfInvoice} = req.body;
     console.log('items  : ',items);
     console.log('currency: ',currency)
     console.log('tax  : ', parseFloat(taxe));
    //  console.log('total  : ',total);
    //  console.log('client  : ',client);
      console.log('client name : ',client.name);
    //  console.log('cashier  : ',cashier);
    //  console.log('cashier email : ',cashier.email);
    //  console.log('invoice number : ',numberOfInvoice);
    let products=[];
     console.log('itelenht : ',items.length)
    items.forEach(item => {
        const { input1, input2, input3,input4 } = item;
        products.push({
          description: input1,
          price: input2,
          quantity: input3,
          line_total: input4,
          'tax-rate': parseFloat(taxe),
        });
      });
            
      try {
        let data = {
          // Customize enables you to provide your own templates
          // Please review the documentation for instructions and examples
          "customize": {
              //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
          },
          "images": {
         //   logo: fs.readFileSync('logoprinc.png', 'base64'),
           // background: fs.readFileSync('images/background.png', 'base64')
        },
          // Your own data
          "sender": {
              "company":"company: "+cashier.name,
              "address":"Email: "+cashier.email,
              "zip":"Address: "+cashier.address,
              
              
              // "city": "Samplecountry",
              // "custom1": "custom value 1",
              //"custom2": "custom value 2",
              //"custom3": "custom value 3"
          },
          // Your recipient
          "client": {
             // "custom1" : "client",
              "company": "client: "+client.name,
              "address": "Address: "+client.address,
              "zip": "Email: "+client.email,
              // "custom1": "custom value 1",
              // "custom2": "custom value 2",
              // "custom3": "custom value 3"
          },
          "information": {
              // Invoice number
              "number":numberOfInvoice,
              // Invoice data
              "date": "12-12-2021",
              // Invoice due date
              "due-date": "31-12-2021"
          },
          // The products you would like to see on your invoice
          // Total values are being calculated automatically
  
          "products": products,
          //  "discount" : 20,
     
          // The message you would like to display on the bottom of your invoice
          "bottom-notice": `Please note that the total after applying ${discount}% discount  is ${total}` ,
          
          // Settings to customize your invoice
          "settings": {
              "currency": currency, // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
              "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')        
              "margin-top": 25, // Defaults to '25'
              "margin-right": 25, // Defaults to '25'
              "margin-left": 25, // Defaults to '25'
              "margin-bottom": 25, // Defaults to '25'
              "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
              "height": "1000px", // allowed units: mm, cm, in, px
              "width": "500px", // allowed units: mm, cm, in, px
              "orientation": "landscape", // portrait or landscape, defaults to portrait
          },
          //"taxe" :    7878
          // Translate your invoice to your preferred language
            "translate": {
          //     "invoice": "FACTUUR",  // Default to 'INVOICE'
          //     "number": "Nummer", // Defaults to 'Number'
          //     "date": "Datum", // Default to 'Date'
          //     "due-date": "Verloopdatum", // Defaults to 'Due Date'
          //     "subtotal": "Subtotaal", // Defaults to 'Subtotal'
          //     "products": "Producten", // Defaults to 'Products'
          //     "quantity": "Aantal", // Default to 'Quantity'
          //     "price": "Prijs", // Defaults to 'Price'
          //     "product-total": "Totaal", // Defaults to 'Total'
          //     "totallllllll": "Totaal", // Defaults to 'Total'
                 "vat": "tax" // Defaults to 'vat'
           },

      };
      try {
        easyinvoice.createInvoice(data, async function (result) {
            //The response will contain a base64 encoded PDF file
           // console.log('PDF base64 string: ', result.pdf);
                // fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
                 res.json({'invoice':result.pdf});
            });
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la génération du PDF:', error);
      }
      } catch (error) {
         console.log('error ', error);
      }
     
    
   
  

    })
 

  /*************** */
   
  
    //Create your invoice! Easy!
    // easyinvoice.createInvoice(data, async function (result) {
    //     //The response will contain a base64 encoded PDF file
    //     console.log('PDF base64 string: ', result.pdf);
    //     await fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
    //     });
    
        // var data = {};
        // const test = async ()=>{
        //   const result = await easyinvoice.createInvoice(data);
        //   await fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
        // }
        // test();
      
    
   


  /*************** */


  app.listen(5000 , ()=>{
      console.log('server running....');
  })
