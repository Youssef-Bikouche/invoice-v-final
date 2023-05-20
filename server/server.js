const express= require('express');
const cors=require('cors');
const { PrismaClient } = require('@prisma/client');
//****************************************************** */
const prisma=new PrismaClient()
const app=new express();
app.use(cors());
app.use(express.json());

//************************************************************ */
prisma.$connect().then(()=>{
  console.log("connected to db")
}).catch((err)=>{
   console.log("error conn db :",err)
})
//*********************************************************** */
app.get('/Home',(req,res)=>{
  res.json('hahahahah');
  console.log("/Home");
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
      res.json({"message": "found","id": company.id})
    }
  }
  else{
    res.json({"message": "invalid informations"})
  }
})

//*********************************************************** */
app.post('/addCompany', async (req, res) => {
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
        },
      });
      res.json({ message: "Created account successfully" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "failed, try later" });
  }
});

//*********************************************************** */
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
  // const newx=await prisma.customer.create({
  //   data : {
  //     fullname: 'yassine rodri',
  //     email : 'yassine@gmail.com',
  //     phone :'0607734338',
  //     address: 'Tanjia gueliz',
  //     companyId: req.body.id,
  //   }
  // })
  // console.log(newx)
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
// app.post('/addCompany',async (req,res)=>{
//   try {
//     const name=await prisma.company.findUnique({
//       where : {
//         name : req.body.companyName,
//       },
//     });
//     if(name){
//       res.json({"message" : "company name already exist"})
//     }
//     else{
//       const email=await prisma.company.findUnique({
//         where : {
//           email : req.body.email,
//         },})
//         if(email){
//           res.json({"message" : "email already exist"})
//         }
//         else{
//           const phone=await prisma.company.findUnique({
//             where : {
//               phone : req.body.phone,
//             },})
//             if(phone){
//               res.json({"message" : "phone number already exist"})
//             }
//             else{
//             const company=await prisma.company.create({
//             data :{
//               name:  req.body.companyName,
//               email: req.body.email,
//               address: req.body.address,
//               phone:   req.body.phone,
//               password: req.body.password,
//             }
//           });
//           res.json({"message": "Created account succesfully"})
//             }
//         }
//     }

//   } catch (error) {
//       console.log(error);
//       res.json({"message": "failed ,try later "})
//   }
  
// })
app.listen('5000',()=>{
  console.log('listening to server on port 5000')
})