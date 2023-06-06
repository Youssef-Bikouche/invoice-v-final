import React, { useState } from 'react';
import '../styles/Contact.css';
import contactIMG from "../media/contact.png";
import emailjs from 'emailjs-com';
import { set } from 'date-fns';

const Contact = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message,setmessage]=useState('');
  const [errormessage,setErrormessage]=useState('');
  const handleSubmit = async(e) => {
      e.preventDefault();
  
      const templateParams = {
        from_email: email,
        to_email: 'mehdi.stage.youssef@gmail.com',
        subject: subject,
        fullname: fullName,
      };
  
      emailjs.send('service_rnisc44', 'template_gm9xvwv', templateParams, 'KeXzt57bqu_PKcjXz')
        .then((response) => {
          console.log('Email sent successfully!', response);
          setErrormessage(true);
          setmessage('your message is sent succesfully')
        })
        .catch((error) => {
          console.error('Failed to send email:', error);
          setErrormessage(true);
          setmessage('failed to send')
        });
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
 
          <div style={{widh: '100%' , margin :'1%',color: 'green'}}>{errormessage ?<div>{message}</div>:<></>}</div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
