import axios from "axios";
export const getPRODUCTS=async(id,setproducts)=>{
  await axios.post("http://localhost:5000/getPRODUCTS",{
          id,
        }).then(res=>{
          setproducts(res.data.products)
        })
  }