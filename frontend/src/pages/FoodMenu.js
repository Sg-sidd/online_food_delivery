import React ,{useState,useEffect} from 'react'
import PublicLayout from '../components/PublicLayout';
import '../styles/home.css';
import { Link } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const FoodMenu = () => {
    const [foods,setFoods] = useState([]);
    const [filteredFoods,setFilteredFoods] = useState([]);

    const [search,setSearch] = useState('');
    const [categories,setCategories] = useState([]);
    const [selectedcategory,setSelectedCategory] = useState('All');

    const [minprice,setMinPrice] = useState(0);
    const [maxprice,setMaxPrice] = useState(500);
    
    const [currentPage,setCurrentPage] = useState(1);
    const foodsPerPage = 9;

      
  useEffect(() => {
    // ✅ Fetch foods
    fetch(`http://127.0.0.1:8000/api/foods/`)
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setFilteredFoods(data);
      })
      .catch((err) => console.error('Error fetching foods:', err));

    // ✅ Fetch categories (no setFoods here)
    fetch(`http://127.0.0.1:8000/api/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

    const handleSearch = (e) =>{
      e.preventDefault();
      applyFilters(search,selectedcategory);
    }  
    
    const handleCategoryChange = (e) =>{
      const category = e.target.value;
      setSelectedCategory(category);
      applyFilters(search,category);
    };

    const applyFilters = (searchTerm, category) =>{
      let result = foods;
      
      if (searchTerm){
        result = result.filter(food=>
        food.item_name.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      if(category!="All") {
         result = result.filter(food=>
        food.category_name == category);
      }

      result = result.filter(food=>
        food.item_price >= minprice && food.item_price<=maxprice);
        setFilteredFoods(result);
        setCurrentPage(1);

    }

    //pagination logic
    const indexOfLastFood = currentPage * foodsPerPage;
    const indexOfFirstFood = currentPage - foodsPerPage;

    const currentFoods = filteredFoods.slice(indexOfFirstFood,indexOfLastFood);

    const totalPages = Math.ceil(filteredFoods.length/foodsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
  return (
    <PublicLayout>
      <div className='container py-5'>
        <h2 className='text-center mb-4 text-primary'>Find Your Delicious Food Here....</h2>

<div className="row mb-4">
  <div className="col-md-8">
    <form onSubmit={handleSearch}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search your favourite food"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          <i className='fa fa-search'></i>
        </button>
      </div>
    </form>
  </div>
  <div className='col-md-4'>
<select className='form-select'
value={selectedcategory}
onChange={handleCategoryChange}
>
  <option value='All'>All categories</option>
  {categories.map((cat) => (
   <option key={cat.id} value={cat.category_name}>{cat.category_name}</option>
  ))}
</select>
  </div>
</div>


<div className='row mb-4'>
  <div className='col-md-12'>
<label className='form-label fw-bold my-2 text-primary'>
Filter by Price: ₹{minprice} - ₹{maxprice}
</label>
<Slider
 range
 min={0}
 max={500}
 defaultValue={[minprice,maxprice]}
 onChange={(value) => {
  setMinPrice(value[0]);
  setMaxPrice(value[1]);
  applyFilters(search,selectedcategory)
 }} >
</Slider>
  </div>

</div>

    <div className='row mt-4'>
           {currentFoods.length === 0 ? (<p className='text-center'>
              No Foods Found
           </p>
           ) : (
              currentFoods.map((food,index)=>(
             <div className='col-md-4 mb-4'>
              <div className='card hovereffect'>
               <img src={`http://127.0.0.1:8000${food.image}`} className='card-img--top' style={{height:"180px"}}/>
              <div className='card-body'>
              <h5 className='card-title'>
               <Link to={`/food/${food.id}`}> {food.item_name} </Link>
               </h5>
               <p className='card-text text-muted'>{food.item_description.slice(0,50)}...</p>
               <div className='d-flex justify-content-between align-items-center'>
                <span className='fw-bold'>₹{food.item_price}</span>
   
                { food.is_available ? (
                 <Link to={`/food/${food.id}`} className='btn btn-outline-primary btn-sm'>
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
         {totalPages > 1 && (
          <nav className='mt-4 d-flex justify-content-center'> 
          <ul className='pagination'>
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
              <button className='page-link'onClick={()=>paginate(1)}> First </button>
            </li>
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
              <button className='page-link'onClick={()=>paginate(currentPage-1)}> Prev </button>
            </li>
            <li className={`page-item disabled`}>
              <button className='page-link'> Page {currentPage} of {totalPages} </button>
            </li>
            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
              <button className='page-link' onClick={()=>paginate(currentPage+1)}>Next</button>
            </li>
            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
              <button className='page-link' onClick={()=>paginate(totalPages)}>Last</button>
            </li>
          </ul>
          </nav>
         )}
   </div>
    </PublicLayout>
  )
}

export default FoodMenu;
