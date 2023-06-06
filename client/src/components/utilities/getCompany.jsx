import axios from "axios";
export const getCompanyInfo=async(id,setcompany=()=>{})=>{
  await axios.post('http://localhost:5000/companyInfo',{
   id,
  }).then(res=>{
   setcompany(res.data.info);
   return res.data.info;
  })
}