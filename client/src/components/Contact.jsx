import React, { useState } from 'react';
import '../styles/Contact.css';
import contactIMG from "../media/contact.png";
import axios from 'axios';
import emailjs from 'emailjs-com';

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
      e.preventDefault();
  
      const templateParams = {
        from_email: email,
        to_email: 'mehdi.stage.youssef@gmail.com', // Replace with your email address
        subject: subject,
        fullname: fullName,
      };
  
      emailjs.send('service_rnisc44', 'template_gm9xvwv', templateParams, 'KeXzt57bqu_PKcjXz')
        .then((response) => {
          console.log('Email sent successfully!', response);
        })
        .catch((error) => {
          console.error('Failed to send email:', error);
        });
    
    // await axios.post("http://localhost:5000/send-email",{
    //  fullName,
    //  email,
    //  subject,
    // }).then(res=>{
    //   console.log(res)
    // })
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
          <input type="text" name={fullName} onChange={(e)=>setFullName(e.target.value)} required/>
          <label htmlFor="">Email :</label>
          <input type="email" name={email} onChange={(e)=>setEmail(e.target.value)} />
          <label htmlFor="">Subject:</label>
          <textarea name={subject} onChange={(e)=>setSubject(e.target.value)} required/>
          <button type="submit" className="submit-contact">
            Submit
          </button>
        </form>
      </div>
      
     
    </div>
  );
};

export default Contact;
