import CryptoJS from "crypto-js";
export const checkLogin=(setverified=()=>{},navigate=()=>{})=>{
  const CryptingKey = "xxx";
  const encryptedData = sessionStorage.getItem('token');
  console.log("encrypted",encryptedData)
  if(encryptedData){
    const decryptedData = CryptoJS.AES.decrypt(encryptedData,CryptingKey).toString(CryptoJS.enc.Utf8);
    console.log("dycrypted",decryptedData)
    if(decryptedData !== 'verified'){
      navigate('/Login');
    }
   else{
    setverified(true);
   }
  }
  
}