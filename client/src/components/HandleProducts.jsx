import { useEffect, useState } from 'react';
import '../styles/HandleProducts.css';
import { getPRODUCTS } from './utilities/getProducts';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import loadinggif from '../media/loading.gif'
import moment from 'moment'
import deleteIcon from '../media/delete.png';
import editIcon from '../media/draw.png'
const HandleProducts = () => {
  const id=sessionStorage.getItem('id');
  const [products,setPRODUCTS]=useState([]);
  const [searchPRODUCT,setsearchPRODUCT]=useState('');
  const [editClicked,setEditClicked]=useState(false);
  const [productToEdit,setProductToEdit]=useState();
  const [newTitle,setNewTitle]=useState();
  const [newPrice,setNewPrice]=useState();
  const [newDescription,setNewDescription]=useState();
 // const [errormessageSearch,setErrormessageSearch]=useState(false);
  const navigate = useNavigate("");
  const [isloading,setIsloading] = useState(true);
  useEffect(()=>{
      getPRODUCTS(id,setPRODUCTS,setIsloading);
       
      console.log('GetProducts: ',products);
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
 const DeleteProduct=async(ProductID)=>{
     try {
      await axios.post('http://localhost:5000/deletePRODUCT',{
        ProductID,
      }).then(res=>{
        if(res.data.message ==="deleted"){
          setpopDeleteProduct(false);
          getPRODUCTS(id,setPRODUCTS,setIsloading);
        }
      })
     } catch (error) {
      console.log(error)
     }
 }
 /************** */
   const handleTitle = (e)=>{
       setNewTitle(e.target.value);
   }
   const handlePrice = (e)=>{
    setNewPrice(e.target.value);
}
const handleDescription = (e)=>{
  setNewDescription(e.target.value);
}

 /************** */
 const handlePopEdit = (id,title,price,description)=>{
      setEditClicked(true);
      setProductToEdit(id);
      setNewTitle(title);
      setNewPrice(price);
      setNewDescription(description);
 }
 /****/
 const saveProductEdited= ()=>{
      console.log(productToEdit);
      try {
             axios.post('http://localhost:5000/editPRODUCT',{id:productToEdit,newTitle:newTitle,
             newDescription:newDescription,newPrice:newPrice})
             .then(res =>{
                   if(res.data.message === 'updated'){
                    setEditClicked(false);
                    getPRODUCTS(id,setPRODUCTS);
                       
                   }
             })

      } catch (error) {
           console.log(error);
      }
 }
 /************** */
  return (  
      
     <div className="all-table-btns">
      <div className="container-all">
      {isloading ? (<div id="divloadinggif" > <img id="loadinggif" src={loadinggif} alt="" /> </div>) : (<>
      
      
        <div className="btn-add-product">
             <button className="addbtn" onClick={()=>navigate('/NewProduct',{id:'e97da3c6-1f8b-4146-8ec6-b16cbe1f7069'})}>Add new product</button>
        </div>
        <div className="search-product">
              <input onChange={(e)=>HandleSearchProduct(e.target.value)} type="text" placeholder='search products here ...'/>
        </div>
        <div className="table-display-products">
              <table>
                <thead>
                 <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Creation Date</th>
                  <th colspan="2">Actions</th>
                  </tr>
                </thead>
               
                {products?.length > 0 ? 
                products.map((product) =>(
                  <>
                  <tr>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.description}</td>
                    <td>{moment(product.createdAt).format('DD-MM-YYYY')}</td>
                    <td> <button onClick={()=>handlePopEdit(product.id,product.name,product.price,product.description)} className="edit-btn"><img src={editIcon} alt="" /></button></td>
                    <td><button className="delete-btn" onClick={()=>handleClosePop(product.id)}> <img src={deleteIcon}  alt="" /> </button></td>
                  </tr>
                  </>
                )):(<>
                
                {searchPRODUCT?.length > 0 ? 
                searchPRODUCT.map((product) =>(
                  <>
                  <tr>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.description}</td>
                    <td>{moment(product.createdAt).format('DD-MM-YYYY')}</td>
                    <td> <button  className="edit-btn">Edit</button></td>
                    <td><button className="delete-btn">Delete</button></td>
                  </tr>
                  </>
                )): <tr> <td colSpan={5}><div className='product-message'>no product was found</div></td></tr>}
                </>)}
                
               
               
         
              </table>
             
        </div>
        </>) }
     </div>
     {editClicked? (<>
            
            <div className="edit-pop" >
               <div onClick={()=>{setEditClicked(false)}} className="close-pop-edit">
                  X 
               </div>
                  <p>Edit product :</p>
                  <input value={newTitle} onChange={ (e)=>handleTitle(e)} id='title' type="text" placeholder='Title'/>
                  <input value={newPrice} onChange={ (e)=>handlePrice(e)} id='price' type="text" placeholder='Price'/>
                  <input value={newDescription} onChange={ (e)=>handleDescription(e)} id='description' type="text" placeholder='Description'/><br></br>
                 <button id="edit-btn" onClick={saveProductEdited}>save</button>
            </div>
            
         
         </>):<></>
 
         }
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
  
  );
  
}
 
export default HandleProducts;