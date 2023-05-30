import axios from "axios";
export const getClients=async(id,setclients,setIsloading=()=>{})=>{
  await axios.post('http://localhost:5000/getClIENTS',{
    id,
  }).then(res=>{
    setclients(res.data.clients);
    setIsloading(false);
})
}