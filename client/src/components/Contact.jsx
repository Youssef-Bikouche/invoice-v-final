import React, { useState } from 'react';
import '../styles/Contact.css';
import contactIMG from "../media/contact.png";
import axios from 'axios';

const Contact = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(fullName,email,subject);
    // const sub = subject;
    // const body = "Hey ,my name is "+fullName;
    // const mailtoLink = `mailto:youssefkun64@gmail;com?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
    // window.location.href = mailtoLink;
    await axios.post("http://localhost:5000/send-email",{
     fullName,
     email,
     subject,
    }).then(res=>{
      console.log(res)
    })
  };


  return (
    <div className="contact-us">
      <div className='contact-left'>
          <img src={contactIMG} alt="" />
      </div>

      <div className='contact-right'>
        <form onSubmit={handleSubmit}>
        <h2>Contact Us</h2>
          <label htmlFor="">full name :</label>
          <input type="text" onChange={(e)=>setFullName(e.target.value)} required/>
          <label htmlFor="">Email :</label>
          <input type="email" onChange={(e)=>setEmail(e.target.value)} />
          <label htmlFor="">Subject:</label>
          <textarea onChange={(e)=>setSubject(e.target.value)} required/>
          <button type="submit" className="submit-contact">
            Submit
          </button>
        </form>
      </div>
      
     
    </div>
  );
};

export default Contact;
