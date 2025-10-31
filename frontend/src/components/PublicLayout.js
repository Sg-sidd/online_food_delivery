import React , {useState,useEffect} from 'react';
import { FaCogs, FaHeart, FaHome, FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaTruck, FaUser, FaUserCircle, FaUserPlus, FaUserShield, FaUtensils } from 'react-icons/fa';
import { Link , useNavigate} from 'react-router-dom';
import '../styles/layout.css';
import { useCart } from '../context/CartContext';


const PublicLayout = ({children}) => {

  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [userName,setUserName] = useState("");
  const {cartCount,setCartCount} = useCart();
  
   const navigate = useNavigate();
   const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");

   const fetchCartCount = async() => {
    if (userId){
      const res = await fetch(`http://127.0.0.1:8000/api/cart/${userId}`);
      const data = await res.json();
      setCartCount(data.length);
    }
   }

    useEffect(()=>{
    if (userId){
      setIsLoggedIn(true);
      setUserName(name);
      fetchCartCount();
    }
    },[userId])

    const handleLogout = ()=>{
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      setIsLoggedIn(false);
      setCartCount(0);
      navigate('/login')
    }
  return (
    <div>
      
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
  <div className="container">
    <Link className="navbar-brand fw-bold" to="#"><FaUtensils className='me-1'/>Laxmi Kitchen</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2">
        <li className="nav-item mmx-1">
          <Link  className="nav-link active"  to="/"><FaHome className='me-1'/>Home</Link>
        </li>
        <li className="nav-item mx-1">
          <Link className="nav-link active" to="/food-menu"><FaUtensils className='me-1'/>Menu</Link>
        </li>
         <li className="nav-item mx-1">
          <Link className="nav-link active" to="#"><FaTruck className='me-1'/>Track</Link>
        </li>

        {!isLoggedIn ? (
           <>
           <li className="nav-item mx-1">
          <Link className="nav-link active" to="/register"><FaUserPlus className='me-1'/>Register</Link>
        </li>
         <li className="nav-item mx-1">
          <Link className="nav-link active" to="/login"><FaSignInAlt className='me-1'/>Login</Link>
        </li>
         <li className="nav-item mx-1">
          <Link className="nav-link active" to="/admin-login"><FaUserShield className='me-1'/>Admin</Link>
        </li>
        </>


        ) : (

         <>
         <li className="nav-item mx-1">
          <Link className="nav-link active" to="/my-orders"><FaUser className='me-1'/>My Orders</Link>
        </li>

         <li className="nav-item mx-1">
          <Link className="nav-link active" to="/cart"><FaShoppingCart className='me-1'/>
          Cart
          {cartCount > 0 && (
            <span>({cartCount})</span>
          )}
          </Link>
        </li>

         <li className="nav-item mx-1">
          <Link className="nav-link active" to="/admin-login"><FaHeart className='me-1'/>Wishlist</Link>
        </li>

         <li class="nav-item dropdown">
          <Link class="nav-link dropdown-toggle text-capitalize" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" >
           <FaUserCircle className='me-1'/> {userName}
          </Link>
          <ul class="dropdown-menu" >
            <li><Link class="dropdown-item" to='/profile'><FaUser className='me-1'/>Profile</Link></li>
            <li><Link class="dropdown-item" to='/change-password'><FaCogs className='me-1'/>Setting</Link></li>
            <li><hr class="dropdown-divider"/></li>
            <li><button class="dropdown-item" onClick={handleLogout}><FaSignOutAlt className='me-1'/>Logout</button></li>
          </ul>
        </li>
         </>

        )}

      </ul>
     
    </div>
  </div>
</nav>

<div>{children}</div>

  <footer className='text-center py-3 mt-5'>
    <div className='container'>
       <p className=''>&copy; 2025 Laxmi Kitchen. All rights reserved</p>
    </div>
  </footer>

    </div>
  )
}

export default PublicLayout;
