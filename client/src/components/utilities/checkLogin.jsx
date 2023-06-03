import CryptoJS from "crypto-js";
export const checkLogin=(setverified=()=>{},navigate=()=>{})=>{
  const CryptingKey = "xxx";
  const encryptedData = sessionStorage.getItem('token');
  if(encryptedData){
    const decryptedData = CryptoJS.AES.decrypt(encryptedData,CryptingKey).toString(CryptoJS.enc.Utf8);
    if(decryptedData !== 'verified'){
      navigate('/Login');
    }
   else{
    setverified(true);
   }
  }
  
}