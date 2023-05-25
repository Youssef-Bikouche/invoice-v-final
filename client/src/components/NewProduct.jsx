import '../styles/NewProduct.css';
import backToIcon from '../media/angle-double-left.png';
import axios from 'axios';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
 const NewProduct = (props) => {
       const [title , setTitle]=useState('');
       const [price , setPrice]=useState();
       const [description , setDescription]=useState();
       const [errUniqueProduct,setErrUniqueProduct] = useState(false);
       const [inputTitleEmpty,setInputTitleEmpty] = useState(false);
       const [inputPriceEmpty,setinputPriceEmpty]= useState(false);
       const [inputDescriptionEmpty,setinputDescriptionEmpty]= useState(false)
       const id=sessionStorage.getItem('id'); 
       const navigate = useNavigate("");

/***FUNCTION ON CHANGE */
   const handleTitle= (e)=>{
       setTitle(e.target.value);
       setErrUniqueProduct(false);
       if(e.target.value===''){
          setInputTitleEmpty(true);
       }
       else{
          setInputTitleEmpty(false);
       }
   }
   const handlePrice= (e)=>{
     setPrice(e.target.value)
 }
 const handleDescription= (e)=>{
     setDescription(e.target.value)
 }
/****** */
   const  addProduct= async()=>{
          if(title === "" ){
                setInputTitleEmpty(true);
          }
          if( price === ""){
                
          }
          else{
         await axios.post('http://localhost:5000/addProduct',{title:title,price:price,description:description,id:id})
         .then(response =>{
              if(response.data.message==='created'){
               console.log('response message',response.data.message);
                navigate('/HandleProducts');
              } else setErrUniqueProduct(true);
         }).catch( err => {
    
          console.error('error',err);
        
         }
             
         
         )
     }
   }



    return(
         <div className="add-product-container">
              <div onClick={()=>navigate('/HandleProducts')}className='backtoproducts-div'>
                 <img title='back to your products' className='backtoproducts-icon'src={backToIcon} alt="back" />
              </div>
                
                <div className="add-product-form">
                     <div  className='label-input '>
                      <label>Title</label>  
                     <input  onChange={(e)=>handleTitle(e)} placeholder="..."  type="text" name="" id="" />
                     {errUniqueProduct ? <p className='error-title-unique' >The name of the product must be unique</p> : null}
                     {inputTitleEmpty ? <p className='error-title-empty' >name field is empty</p> : null}
                     </div>
                     <div className='label-input '>
                     <label>Price</label>
                     <input  onChange={(e)=>handlePrice(e)} placeholder="..." type="number" name="" id="" />
                     {inputPriceEmpty ? <p className='error-title-empty' >price is empty</p> : null}
                     </div>
                     <div className='label-input '>
                     <label>Description</label>
                     <input onChange={(e)=>handleDescription(e)} placeholder="..."  type="text" name="" id="" />
                     {inputDescriptionEmpty ? <p className='error-title-empty' >Description is empty</p> : null}
                     </div>
                     <div className='add-div'>
                        <button  onClick={addProduct}>Add</button>
                     </div>
                 
                  
                </div>
         </div>
    )
 }

 export default NewProduct;