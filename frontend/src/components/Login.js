import React, {useState} from 'react'
import {  FaSignInAlt, FaUserPlus } from 'react-icons/fa'
import PublicLayout from '../components/PublicLayout';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom';

const Login = () => {

   const [formData,setformData] = useState({
      emailcont : '',
      password : '',
       })
  
    const navigate = useNavigate();
    
     const handleChange = (e) => {
      const {name,value} = e.target;
  
      setformData((prev) =>({
        ...prev,
        [name]:value
      }));
    }
  
     const handleSubmit = async (e) => {
             e.preventDefault();
  
             const {emailcont,password} = formData
             
            try{
            const response = await fetch("http://127.0.0.1:8000/api/login/",{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({emailcont , password})
             });
             const result = await response.json();

             if (response.status === 200){
               toast.success(result.message || 'Login Successful');
               localStorage.setItem('userId',result.userId);
               localStorage.setItem('userName',result.userName);
               setformData({
               emailcont  : '',
               password : '',
    
               });
              setTimeout(()=>{
             navigate('/')
            },2000);


             }
             else{
               toast.error(result.message || 'Something went wrong');
               }
             }
             catch(error){
              console.error(error);
              toast.error("Error connecting to server");
             }
           };

  return (
    <PublicLayout>
       <ToastContainer position='top-center' autoClose={2000}/>
    <div className='container py-5 '>
      <div className='row align-items-center'>
        <div className='col-md-6 p-2'>
        <h3 className='text-center text-primary mb-4'>
         <FaSignInAlt className='me-2'/>User Login</h3>
         <form className='card p-4 shadow' onSubmit={handleSubmit} >
      
                <div className='mb-3'>
                 <input name='emailcont' type='text' className='form-control' value={formData.emailcont} onChange={handleChange}   placeholder='Email or Mobile Number' required/>
                </div>

                 <div className='mb-3'>
                 <input name='password' type='password' className='form-control' value={formData.password} onChange={handleChange}   placeholder='Password' required/>
                </div>
                 
                <div className='d-flex justify-content-between'>
                 <button type='submit' className='btn btn-primary mt-2 '> 
                  <FaSignInAlt className='me-2'/>Login
                  </button>

                  <button type='submit' className='btn btn-outline-secondary mt-2 ' onClick={()=>navigate('/register')}> 
                  <FaUserPlus className='me-2'/>Register
                  </button>
                </div>
                
         </form>

        </div>
        <div className='col-md-6  d-flex align-item-center justify-content-center'>
        <div className='text-center'>
          <img src='/images/logolaxmi.png' className='img-fluid rounded-3 w-75' style={{maxHeight:"600px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"}}/>
        </div>
        </div>

      </div>
      
    </div>

    </PublicLayout>
  )
}

export default Login;
