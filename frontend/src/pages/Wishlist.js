import React ,{useState,useEffect} from 'react'
import PublicLayout from '../components/PublicLayout';
import '../styles/home.css';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWishlist } from '../context/WishListContext';

const Wishlist = () => {
  const [wishlist,setWishlist] = useState([]);
    const {wishlistCount,setWishlistCount} = useWishlist();
  
    const user_id = localStorage.getItem('userId');

      
   const fetchWishlist = async() => {
    if (user_id){
      const res = await fetch(`http://127.0.0.1:8000/api/wishlist/${user_id}`);
      const data = await res.json();
      setWishlist(data);
    }
   }

    
const removeFromWishlist = async (food_id) =>{
  
try{
const response = await fetch(`http://127.0.0.1:8000/api/wishlist/remove/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user_id: parseInt(user_id),
    food_id: food_id
  }),
});
          if(response.ok){
            
      const updatedCount = await fetch(`http://127.0.0.1:8000/api/wishlist/${user_id}`);
      const wishlistData = await updatedCount.json();
      setWishlistCount(wishlistData.length);

            toast.success("Removed from wishlist");
            fetchWishlist();
          }
          else{
               toast.error('Failed to update wishlist');
          }
}
catch (error)
{
   toast.error('Something went wrong');
}
}

 useEffect(()=> {  
           
         fetchWishlist();
            
        },[user_id]);
  return (
    <PublicLayout>
     <div className='container py-5'>
      <h2 className='mt-4 text-center text-primary'>My Wishlist</h2>
      <div className='row mt-4'>
              {wishlist.length === 0 ? (<p className='text-center'>
                 No food items in Wishlist
              </p>
              ) : (
                 wishlist.map((item,index)=>(
                <div className='col-md-4 mb-4' key={item.index}>
                 <div className='card hovereffect'>
                  <div className='position-relative'>
                    <img src={`http://127.0.0.1:8000${item.image}`} className='card-img-top' style={{height:"180px"}}/>
                    <i className="fas fa-heart heart-anim position-absolute top-0 end-0 m-2 text-danger"
            style={{
            cursor: 'pointer',
            background: 'white',
            fontSize: '25px',
            padding: '5px',
            borderRadius: '50%',
            width: '40px', // Set equal width & height
            height: '40px', 
            display: 'flex', // Center the icon
            justifyContent: 'center', // Center the icon
            alignItems: 'center' // Center the icon
          }}
          onClick={()=>removeFromWishlist(item.food_id)}
                    ></i>
                  </div>
                 <div className='card-body'>
                 <h5 className='card-title'>
                  <Link to={`/food/${item.food_id}`}> {item.item_name} </Link>
                  </h5>
                  <p className='card-text text-muted'>{item.item_description.slice(0,50)}...</p>
                  <div className='d-flex justify-content-between align-items-center'>
                   <span className='fw-bold'>₹{item.item_price}</span>
      
                   { item.is_available ? (
                    <Link to={`/food/${item.food_id}`} className='btn btn-outline-primary btn-sm'>
                   <i className='fas fa-shopping-basket me-1'></i>Order Now
                   </Link> 
                   ) : (
                    <div>
                      <button  title='This food item is not available right now. Please check later'> 
                      <Link className='btn btn-outline-secondary btn-sm'>
                   <i className='fas fa-times-circle me-1'></i>Currently Unavailable
                   </Link> 
      
                      </button>
                    </div>
                   )}
                  </div> 
                 </div>
                 </div>
            </div>
                 ))
              )}
            </div>
     </div>
    </PublicLayout>
  )
}

export default Wishlist;
