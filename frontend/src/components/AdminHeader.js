import React from 'react'
import { FaBars, FaBell, FaChevronLeft, FaChevronRight, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({toggleSidebar,sidebarOpen , neworders}) => {
    const navigate = useNavigate();

  const handleLogout = () => {
     localStorage.removeItem("adminUser");
     navigate("/admin-login");
  }
  return (
   <nav className='navbar navbar-expand-lg bg-white border-bottom px-3 shadow-sm'>

<button className='btn btn-outline-dark me-3' onClick={toggleSidebar} >
{sidebarOpen ? <FaChevronLeft/> : <FaChevronRight/>}
</button>

    <span className='navbar-brand fw-semibold'><i className='fas fa-utensils me-2'></i>Laxmi Kitchen</span>
      <button className='navbar-toggler border-0 ms-auto'>
      <FaBars/>
    </button>

    <div  className='collapse navbar-collapse'>
      <ul className='navbar-nav ms-auto align-item-center gap-3'>
        <li className='nav-item position-relative'>
          <button className='btn btn-outline-secondary position-relative' onClick={()=>{
            if(neworders > 0 ){
              navigate('/order-not-confirmed');
            }
          }}
          title ={neworders > 0 ? "view New Orders" : "No new orders"}  
          >
            <FaBell/>
            <span className='badge bg-danger position-absolute top-0 start-100 translate-middle '>{neworders}</span>
          </button>
        </li>

        <li className='nav-item'>
           <button className='btn btn-outline-danger' onClick={handleLogout}>
            <FaSignOutAlt className='me-2'/>Logout
          </button>
        </li>
      </ul>
    </div>
   </nav>
  )
}

export default AdminHeader
