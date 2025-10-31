import React , {useState} from 'react'
import PublicLayout from '../components/PublicLayout';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom';

const Register = () => {

   const [formData,setformData] = useState({
    firstname :'',
    lastname : '',
    email  : '',
    mobile_no :'',
    password: '',
    confirm_password:'',
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

           const {firstname ,lastname ,email ,mobile_no ,password ,confirm_password} = formData
           
          if(password!==confirm_password){
            toast.error("Password and Confirn Password do not match");
            return;
          }

          try{
          const response = await fetch("http://127.0.0.1:8000/api/register/",{
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body:JSON.stringify({firstname ,lastname ,email ,mobile_no ,password})
           });
           const result = await response.json();
           if (response.status === 201){
             toast.success(result.message || 'You have successfully registered');
             setformData({
               
             firstname :'',
             lastname : '',
             email  : '',
             mobile_no :'',
             password: '',
             confirm_password:''
  
             });
            setTimeout(()=>{
             navigate('/login')
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
         }
  return (
    <PublicLayout>
       <ToastContainer position='top-center' autoClose={2000}/>
    <div className='container py-5 '>
      <div className='row shadow-lg rounded-4'>
        <div className='col-md-6 p-2'>
        <h3 className='text-center text-primary mb-4'>
          <i className='fas fa-user-plus me-2'></i>User Registration</h3>
         <form  onSubmit={handleSubmit} >
              <div className='mb-3'>
                 <input name='firstname' type='text' className='form-control' value={formData.firstname} onChange={handleChange}   placeholder='First Name' required/>
                </div>

                <div className='mb-3'>
                 <input name='lastname' type='text' className='form-control'value={formData.lastname} onChange={handleChange}    placeholder='Last Name' required/>
                </div>

                <div className='mb-3'>
                 <input name='email' type='email' className='form-control'value={formData.email} onChange={handleChange}    placeholder='Enter Email' required/>
                </div>

                <div className='mb-3'>
                 <input name='mobile_no' type='text' className='form-control' value={formData.mobile_no} onChange={handleChange}    placeholder='Enter Mobile Number' required/>
                </div>

                <div className='mb-3'>
                 <input name='password' type='password' className='form-control' value={formData.password} onChange={handleChange}   placeholder='Password' required/>
                </div>

                 <div className='mb-3'>
                 <input name='confirm_password' type='password' className='form-control' value={formData.confirm_password} onChange={handleChange}   placeholder='Confirm Password' required/>
                </div>

                
                 <button type='submit' className='btn btn-primary mt-2 w-100'> 
                  <i className='fas fa-user-check me-2'></i>Register
                  </button>
         </form>

        </div>
        <div className='col-md-6  d-flex align-item-center justify-content-center'>
        <div className='p-4  text-center '>
          <img src='/images/adminbg.jpg' className='img-fluid' style={{maxHeight:"400px" }}/>
          <h5 className='mt-3 text-primary'> Registration is fast, secure and free.</h5>
          <h5 className='text-muted small'> Join our food family and enjoy delicious food delivered to your door.</h5>
        </div>
        </div>

      </div>
      
    </div>

    </PublicLayout>
  )
}

export default Register;

