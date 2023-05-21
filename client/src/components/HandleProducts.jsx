import { useEffect, useState } from 'react';
import '../styles/HandleProducts.css';
import { getPRODUCTS } from './utilities/getProducts';
import axios from "axios";
const HandleProduct = () => {
  const id=sessionStorage.getItem('id');
  const [products,setPRODUCTS]=useState([]);
  const [searchPRODUCT,setsearchPRODUCT]=useState('');
 
  useEffect(()=>{
      getPRODUCTS(id,setPRODUCTS);
      console.log(products);
  },[])
  const HandleSearchProduct=async(term)=>{
    if(term.length > 0){
    try {
        await axios.post("http://localhost:5000/searchPRODUCT",{
          term,
          id,
        }).then(res=>{
          console.log(res)
          if(res.data.product){
            console.log(res.data.product);
            setPRODUCTS([]);
            setsearchPRODUCT(res.data.product);
           
          } 
    })
    } catch (error) {
      console.log(error)
    }
  }
  else{
    setsearchPRODUCT('');
    getPRODUCTS(id,setPRODUCTS);
  }  
 }

 const [popDeleteProduct,setpopDeleteProduct]=useState(false);
 const [productID,setproductID]=useState('')
 const handleClosePop=(id)=>{
       setpopDeleteProduct(true);
       setproductID(id);

 }
 const DeleteProduct=async(id)=>{
     console.log(id);
     try {
      await axios.post('http://localhost:5000/deletePRODUCT',{
        id,
      }).then(res=>{
        console.log(res);
        if(res.data.message ==="deleted"){
          setpopDeleteProduct(false);
          getPRODUCTS(id,setPRODUCTS);
          
        }
      })
     } catch (error) {
      
     }
 }
  return (  
    <div className="Products-table-container">
    
      <div className='Products-table'>
            <input type="search" placeholder='search a product' onChange={(e)=>HandleSearchProduct(e.target.value)} />

        <div className="products-table-header">
            <div className='product-name x'>Product</div>
            <div className='product-cost x'>Unit cost</div>
            <div className='product-description x'>Description</div>
            <div className='product-options x'>Options</div>
        </div>
   
        {products?.length > 0 ? 
        (<>
          {products.map((product)=>(
            <div key={product.id} className="products-table-content">
                <div className='product-name x'>{product.name}</div>
                <div className='product-cost x'>{product.price}</div>
                <div className='product-description x'>{product.description}</div>
                <div className='product-options x'>
                  <button>Edit</button>
                  <button onClick={()=>handleClosePop(product.id)} >Delete</button>
                </div>
            </div>
          ))}
        
        </>)
        :(<>

           {searchPRODUCT?.length > 0 ? 
              (<>
                {searchPRODUCT.map((product)=>(
                  <div key={product.id} className="products-table-content">
                      <div className='product-name x'>{product.name}</div>
                      <div className='product-cost x'>{product.price}</div>
                      <div className='product-description x'>{product.description}</div>
                      <div className='product-options x'>
                        <button>Edit</button>
                        <button>Delete</button>
                      </div>
                  </div>
                ))}
              
              </>)
              :(<>
                <div className='product-message'>no product was found</div> 
              </>)}
        </>)}
        


      {popDeleteProduct? (<>
        <div className="popDeleteProduct">
            <div className="close-pop" onClick={()=>setpopDeleteProduct(false)}>X</div>
            <h2>Do you really want to delete it ?</h2>
            <div className="delete-options">
                <button onClick={()=>DeleteProduct(productID)}>Yes</button>
                <button onClick={()=>setpopDeleteProduct(false)}>No</button>
            </div>
            <div>{Error}</div>
       </div>
      
      </>)
      :(<></>)
      }
        
      </div>
    </div>
  );
}
 
export default HandleProduct;