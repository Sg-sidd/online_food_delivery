import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditFood = () => {
  const { id } = useParams();
  const adminUser = localStorage.getItem('adminUser');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    item_price: '',
    item_description: '',
    image: '',
    item_quantity: '',
    is_available: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }

    // Fetch existing food details
    fetch(`http://127.0.0.1:8000/api/edit-foods/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          ...data,
          is_available: Boolean(data.is_available),
        });
      })
      .catch((err) => console.error('Error fetching food data:', err));

    // Fetch categories
    fetch('http://127.0.0.1:8000/api/categories/')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, [id, adminUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();

  data.append('category', formData.category);
  data.append('item_name', formData.item_name);
  data.append('item_description', formData.item_description);
  data.append('item_quantity', formData.item_quantity);
  data.append('item_price', formData.item_price);

  // ✅ Append image only if new file selected
  if (formData.image instanceof File) {
    data.append('image', formData.image);
  }

  // ✅ Include availability
  data.append('is_available', formData.is_available);

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/edit-foods/${id}/`, {
      method: 'PUT',
      body: data,
    });

    const result = await response.json();

    if (response.ok) {
      toast.success(result.message || 'Food item updated successfully!');
      // ✅ Redirect to Manage Food page after 2 seconds
      setTimeout(() => {
        navigate('/manage-food');
      }, 2000);
    } else {
      toast.error(result.error || 'Failed to update food item');
      console.error('Server error:', result);
    }
  } catch (error) {
    console.error('Network error:', error);
    toast.error('Error connecting to server');
  }
};


  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="row">
        <div className="col-md-8">
          <div className="p-4 shadow-sm rounded">
            <h4 className="mb-4">
              <i className="fas fa-pen-square text-primary me-2"></i>
              Edit Food Item
            </h4>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Food Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Food Item Name</label>
                <input
                  name="item_name"
                  type="text"
                  className="form-control"
                  value={formData.item_name}
                  onChange={handleChange}
                  placeholder="Enter food item name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="item_description"
                  className="form-control"
                  value={formData.item_description}
                  onChange={handleChange}
                  placeholder="Enter description..."
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  name="item_quantity"
                  type="text"
                  className="form-control"
                  value={formData.item_quantity}
                  onChange={handleChange}
                  placeholder="e.g. 2pcs / large / small"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Price (₹)</label>
                <input
                  name="item_price"
                  type="number"
                  step=".01"
                  className="form-control"
                  value={formData.item_price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 form-check form-switch">
                <input
                  name="is_available"
                  type="checkbox"
                  checked={formData.is_available}
                  className="form-check-input"
                  onChange={(e) =>
                    setFormData({ ...formData, is_available: e.target.checked })
                  }
                />
                <label className="form-check-label">
                  {formData.is_available ? 'Available' : 'Not Available'}
                </label>
              </div>

              <div className="mb-3">
                <label className="form-label">Image</label>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="col-md-6">
                    {formData.image && (
                      <img
                        src={
                          formData.image instanceof File
                            ? URL.createObjectURL(formData.image)
                            : `http://127.0.0.1:8000${formData.image}`
                        }
                        className="img-fluid"
                        style={{
                          maxHeight: '100px',
                          padding: '4px',
                          border: '1px solid',
                          borderRadius: '8px',
                        }}
                        alt="Food"
                      />
                    )}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-2">
                <i className="fas fa-plus me-2"></i>Update Food Item
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <i
            className="fas fa-pizza-slice"
            style={{ fontSize: '180px', color: '#e5e5e5' }}
          ></i>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditFood;
