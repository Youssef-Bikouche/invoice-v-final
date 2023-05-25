export const clearSESSION=()=>{
   sessionStorage.removeItem('token');
   sessionStorage.removeItem('id');
   sessionStorage.removeItem('companyName');
}