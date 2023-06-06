const express=require('express');
const cors=require('cors');
const fs=require('fs');
const easyinvoice = require('easyinvoice');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('your-sendgrid-api-key');

//****************************************************** */
const prisma=new PrismaClient()
const app=new express();
app.use(cors());
app.use(express.json());
let pdfCONTENT='';
//************************************************************ */
prisma.$connect().then(()=>{
  console.log("connected to db")
}).catch((err)=>{
   console.log("error conn db :",err)
})
//*********************************************************** */
app.get('/Home',(req,res)=>{
  
})
//*********************************************************** */
app.post('/login',async (req,res)=>{
  const company=await prisma.company.findUnique({
    where : {
      name: req.body.username,
    }
  })
  if(company){
    if(company.password === req.body.password){
      res.json({"message": "found","id": company.id,"username": company.name,'fileLogo':company.fileLogo})
    }
  }
  else{
    res.json({"message": "invalid informations"})
  }
})
/*******TEST LOGO******** */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Définissez le dossier de destination où le fichier sera stocké
    cb(null, 'logos-companies/');
  },
  filename: function (req, file, cb) {
    // Générez un nom de fichier unique pour éviter les conflits
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
     fileLogo = file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop();
    cb(null, fileLogo);

  }

});
const upload = multer({ storage: storage });
/******** */
//********************* */
app.post('/logos', (req, res) => {
  const logoname = req.body.logoname;
  console.log('logoname :', logoname);
  
  const imagePath = path.join(__dirname, 'logos-companies', logoname);
     
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier image :', err);
      return res.status(500).send('Erreur lors de la lecture du fichier image');
    }

    const base64Image = Buffer.from(data).toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

    res.json({ imageDataUrl });
  });
});
//*********************************************************** */
app.post('/addCompany', upload.single('image'),async (req, res) => {
try {

  const [name, email, phone] = await Promise.all([
    prisma.company.findUnique({ where: { name: req.body.companyName } }),
    prisma.company.findUnique({ where: { email: req.body.email } }),
    prisma.company.findUnique({ where: { phone: req.body.phone } }),
  ]); 
  if (name) {
    res.json({ message: "company name already exist" }); 
  } else if (email) {
    res.json({ message: "email already exist" });
  } else if (phone) {
    res.json({ message: "phone number already exist" });
  } else {

    const company = await prisma.company.create({ 
      data: {
        name: req.body.companyName,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        password: req.body.password, 
        fileLogo ,
      },
    });
    res.json({ message: "Created account successfully",created : true });
  }
} catch (error) {
  console.log(error);
  res.json({ message: "failed, try later" });
}
});

//************************************* */
/*********** */
app.post('/editPRODUCT',async (req,res)=>{
  const {id,newTitle,newDescription,newPrice}=req.body;
  try {
   const updatedRecord = await prisma.product.update({
     where: {
       // Specify the condition for the record you want to update
       id: id,
     },
     data: {
       // Specify the fields and their new values
       name: newTitle,
       price: parseFloat(newPrice),
       description: newDescription,
     },
   });
   res.json({"message":"updated"});
  } catch (error) {
    console.log(error);
  }
} )
/********** */
app.post('/addProduct', async(req,res)=>{
const {id,title,price,description}=req.body;
try {
await prisma.product.create({
data: {
 name: title,
 price:parseFloat(price),
 description:description,
 companyId:id
},
});

res.json({"message":"created"});
} catch (error) {
res.json({"message":error});
console.log(error);
}


})

//********************* */
app.post('/getPRODUCTS',async(req,res)=>{
  try {
    const products= await prisma.product.findMany({
      where : {
        companyId: req.body.id
      }
     })
     res.json({'products': products})
  } catch (error) {
    console.log(error)
  }
})

//************* */


/*********** */


app.post('/deletePRODUCT',async (req,res)=>{
  try {
    await prisma.product.delete({
      where :{
        id: req.body.ProductID,
      }
    })
     res.json({"message": "deleted"})
  } catch (error) {
     console.log(error);
  }
})
//*********************************************************** */
app.post('/companyInfo',async(req,res)=>{
  try {
    const info= await prisma.company.findUnique({
      where : {
        id: req.body.id
      }
     })
     res.json({'info': info})
  } catch (error) {
     res.json(error)
  }
})
//*********************************************************** */
app.post('/getCLIENTS',async(req,res)=>{
  try {
    const clients=await prisma.customer.findMany({
      where :{
        companyId : req.body.id,
      }
    })
    res.json({"clients": clients});
  } catch (error) {
    console.log(error)
  }
})
//*********************************************************** */

app.post('/searchPRODUCT',async(req,res)=>{
  const searchterm = req.body.term;
  const companyId = req.body.id;
  try {
    const product = await prisma.product.findMany({
      where: {
        companyId: companyId,
        name: {
          contains: searchterm,
          }
        }
      })
      res.json({"product" : product})
    } catch (error) {
      res.json(error)
    }
})

//******************************************************************* */
app.post('/countSTATS',async(req,res)=>{  
    const company = await prisma.company.findUnique({
      where: { 
        id: req.body.id, 
      },
      include: {
        product: true,
        customer: true,
        invoiceHISTORY: true,
      },
    });
  
    if (!company) {
      console.log('Company not found');
    }
  
    const productCount = company.product.length;
    const customerCount = company.customer.length;
    const invoiceCount = company.invoiceHISTORY.length;
    res.json({'productCount': productCount,'customerCount': customerCount,'invoiceCount': invoiceCount})
})



app.post('/updateCompanyInfo', async (req, res) => {
  try {
    const { id, name, email, address, phone } = req.body;
    const THIScompany=await prisma.company.findUnique({
      where: {
        id: id,
      }
    })
    if(THIScompany.name === name && THIScompany.email === email && THIScompany.address === address && THIScompany.phone === phone){
      
    }
    else{
    let namee=null;
    let emaill=null;
    let phonee=null;
    if (name && THIScompany.name !== name) {
      namee = await prisma.company.findUnique({ where: { name } });
    }

    if (email && THIScompany.email !== email) {
      emaill = await prisma.company.findUnique({ where: { email } });
    }

    if (phone && THIScompany.phone !== phone) {
      phonee = await prisma.company.findUnique({ where: { phone } });
    }
    if (namee) {
      res.json({ message: "company name already exist" });
    } else if (emaill) {
      res.json({ message: "email already exist" });
    } else if (phonee) {
      res.json({ message: "phone number already exist" });
    } else {
      const updatedCompany = await prisma.company.update({
        where: { id },
        data: { name, email, address, phone },
      })};
      res.json({ message: "Details been changed successfully" });
    }
    }catch(error){

    }
  });

app.post('/verifyPASSWORD',async(req,res)=>{
    const company=await prisma.company.findUnique({
      where: {
        id : req.body.id,
      }
    })
      if(company.password === req.body.confirmPASSWORD){
        res.json({message:'correct'})
      }
})

app.post('/deleteACCOUNT',async(req,res)=>{
   
     try {
        await prisma.company.delete({
        where : {
          id: req.body.id,
        }
       })
         res.json({message : 'deleted'})
    
     } catch (error) {
         res.json({message : 'not deleted'})
     }
   
})

//************************************************************** */


//******************************************************** */
//********************************************************* */
app.post('/downloadpdf', (req,res)=>{
  const getCurrentDate=()=>{
    let date=new Date();
    let currentDATE=`${date.getDate()}-${date.getMonth() +1}-${date.getFullYear()}`;
    return currentDATE ;
}
  let {items} =  req.body;     
  let {total} =  req.body;
  let {taxe} =  req.body;
  let {client} = req.body;
  let {cashier} = req.body;
  let {discount} = req.body;
  let {currency} = req.body
  let {numberOfInvoice} = req.body;
  let products=[];
  items.forEach(itemx => {
      const { item ,unitCost , quantity, lineTotal} = itemx;
      products.push({
        description: item,
        price: unitCost,
        quantity: quantity,
        line_total: lineTotal,
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
          logo:cashier.fileLogo? fs.readFileSync('./logos-companies/'+cashier.fileLogo, 'base64'):null,
      },
        // Your own data
        "sender": {
            "company": "Company: "+cashier.name,
            "address": "Email: "+cashier.email,
            "zip"    : "Address: "+cashier.address,
            "country": "Company phone : "+cashier.phone,
            
            
            // "city": "Samplecountry",
            // "custom1": "custom value 1",
            //"custom2": "custom value 2",
            //"custom3": "custom value 3"
        },
        // Your recipient
        "client": {
           // "custom1" : "client",
            "company": "Client : "+client.name,
            "address": "Address : "+client.address,
            "zip"    : "Email: "+client.email,
            "country": "Client phone : "+client.phone,
            // "custom1": "custom value 1",
            // "custom2": "custom value 2",
            // "custom3": "custom value 3"
        },
        "information": {
            // Invoice number
            "number":numberOfInvoice,
            // Invoice data
            "date": getCurrentDate(),
            // Invoice due date
            "due-date": "---"
        },
        // The products you would like to see on your invoice
        // Total values are being calculated automatically

        "products": products,
        //  "discount" : 20,
   
        // The message you would like to display on the bottom of your invoice
        "bottom-notice": `Please note that the total after applying ${discount}% discount  is ${total} ${currency}` ,
        
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
            // "due-date": " ", // Defaults to 'Due Date'
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
               pdfCONTENT=result.pdf;
              //  pdfCONTENT=pdfCONTENT.toString('base64');
               res.json({'invoice':result.pdf});
               
          });
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la génération du PDF:', error);
    }
    } catch (error) {
       console.log('error ', error);
    }

  })

app.post('/addINVOICE',async(req,res)=>{
   const invoice=await prisma.invoiceHISTORY.create({
    data :{
      invoiceNUMBER: req.body.invoiceNumber,
      total: req.body.Total,
      receiver: req.body.fullName,
      receiverPhone: req.body.phoneCustomer,
      companyName: req.body.companyName  
    }
   })
   console.log(invoice)
})

app.get('/getINVOICES', async (req, res) => {
  try {
    const companyName = req.query.companyName;
    const x=req.query.orderby;
    console.log(x);
    if (companyName) {
      if(x.length > 0){
        const invoices = await prisma.invoiceHISTORY.findMany({
          where: {
            companyName: companyName,
          },
          orderBy: {
           [x] : 'desc',
          }
        });
        res.json({ "invoices": invoices });
      }
      else{
        const invoices = await prisma.invoiceHISTORY.findMany({
          where: {
            companyName: companyName,
          },
        });
        res.json({ "invoices": invoices });
      }    
    }
    
      
    
   
  } catch (error) {
    console.error(error);
  }
});

app.put('/paymentUPDATE',async(req,res)=>{
  try {
    const update=await prisma.invoiceHISTORY.update({
      where : {
        id: req.body.id,
      },
      data: {
         payed : req.body.status,
      }
    });
    console.log(update)
    res.json({message: true})
  } catch (error) {
    console.log(error)
  }
      
      
})
app.delete('/clearHISTORY',async(req,res)=>{
  console.log(req.body.companyName);
  try {
    const history=await prisma.invoiceHISTORY.deleteMany({
      where : {
        companyName: req.body.companyName,
      }
     })
     console.log(history);
     res.json({message: true})
  } catch (error) {
    console.log(error)
  }
   
})

app.delete('/deleteINVOICE',async(req,res)=>{
  console.log(req.query.id)
    try {
      const invoice=await prisma.invoiceHISTORY.delete({
        where:{
             id: req.query.id,
        }
      })
      res.json({message: true})
    } catch (error) {
        console.log(error);
    }
})
app.post('/searchINVOICE',async(req,res)=>{
  try {
    const invoices=await prisma.invoiceHISTORY.findMany({  
        where: {
          companyName: req.body.companyName,
          receiver: {
            contains: req.body.term,
            }
          }
    })
    res.json({invoices : invoices})
  } catch (error) {
    console.log(error)
  }
})
//********************* */
app.post('/getCLIENTS',async(req,res)=>{
  try {
    const clients=await prisma.customer.findMany({
      where :{
        companyId : req.body.id,
      }
    })
    res.json({"clients": clients});
  } catch (error) {
    console.log(error)
  }
})//******************** */
app.post('/addClient', async(req,res)=>{
  const {id,name,address,email,phone}=req.body;
  try {
  await prisma.customer.create({
  data: {
   fullname: name,
   address:address,
   email:email,
   phone:phone,
   companyId:id
  }, 
  });
  
  res.json({"message":"created"});
  } catch (error) {
  res.json({"message":error.meta.target});
  console.log(error.meta.target);
  }
  
  })
//******************* */
app.post('/editClient',async (req,res)=>{
  const {id,newName,newEmail,newAddress,newPhone}=req.body;
  try {
   const updatedRecord = await prisma.customer.update({
     where: {
       // Specify the condition for the record you want to update
       id: id,
     },
     data: {
       // Specify the fields and their new values
       fullname: newName,
       address: newAddress,
       email: newEmail,
       phone:newPhone
     },
    });
   res.json({"message":"updated"});
  }catch (error) {
    console.log(error.meta.target);
    res.json({"message":error.meta.target});
  }
} )
/******************* */
  app.post('/deleteClient', async(req,res)=>{
       try {
        await prisma.customer.delete({
          where :{
            id: req.body.id,
          }
        })
         res.json({"message": "deleted"})
       } catch (error) {
         console.log(error);
       }
       
  })
/********************* */

app.post('/searchClient',async(req,res)=>{
  const searchterm = req.body.term;
  const companyId = req.body.companyID;
  try {
    const client = await prisma.customer.findMany({
      where: {
        companyId: companyId, 
        fullname: {
          contains: searchterm,
          }
        }
      })
      res.json({"client" : client}) 
      console.log(client)
    } catch (error) {
      res.json(error)
    }
})
/********************* */

//**************************************************************** */
app.post('/sendbyEMAIL', async (req, res) => {
  const email=req.body.email;
  const pdf64 = pdfCONTENT.replace(/^data:application\/pdf;base64,/, '');

  // Decode the Base64 string
  const pdfFILE = Buffer.from(pdf64, 'base64');
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'mehdi.stage.youssef@gmail.com',
        pass: 'pugewpcyxydmufei',
      },
    });

    const mailOptions = {
      from: 'mehdi.stage.youssef@gmail.com',
      to: email,
      subject: 'Invoice',
      text: 'Attached is the invoice PDF.',
      attachments: [
        {
          filename: 'myInvoice.pdf',
          content: pdfFILE,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.messageId);
      }
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
});


//************************************************************ */
app.listen('5000',()=>{
  console.log('listening to server on port 5000')
})