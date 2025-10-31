import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodDetail = () => {
  const userId = localStorage.getItem("userId");
  const [food, setFood] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
 

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/foods/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFood(data);
      });
  }, []);
const handleAddToCart = async () => {
  if (!userId) {
    navigate("/login");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/cart_add/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        foodId: food.id,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success(result.message || "Item added to cart");
      
      setTimeout(()=>{
             navigate('/cart');
            },2000);

    } else {
      toast.error(result.message || "Something went wrong");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error connecting to server");
  }
};



  if (!food) return <div>Loading...</div>;
  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <div className="row">
          <div className="col-md-5 text-center">
            <Zoom>
              <img
                src={`http://127.0.0.1:8000${food.image}`}
                style={{ maxHeight: "200px", width: "100%" }}
              />
            </Zoom>
          </div>
          <div className="col-md-7 ">
            <h2>{food.item_name}</h2>
            <p className="text-muted">{food.item_description}</p>
            <p>
              <strong>Category:</strong> {food.category_name}
            </p>
            <h4>₹{food.item_price}</h4>
            <p className="mt-3">
              Shipping Charges:<strong>Free</strong>
            </p>

            {food.is_available ? (
              <button
                to={`/food/${food.id}`}
                className="btn btn-warning btn-lg mt-3 px-4"
                onClick={handleAddToCart}
              >
                <i className="fas fa-cart-plus me-1"></i>Add to Cart
              </button>
            ) : (
              <div>
                <button title="This food item is not available right now. Please check later">
                  <Link className="btn btn-outline-secondary btn-sm">
                    <i className="fas fa-times-circle me-1"></i>Currently
                    Unavailable
                  </Link>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default FoodDetail;
