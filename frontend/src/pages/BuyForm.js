import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaTruck, FaCreditCard } from 'react-icons/fa';
import axios from 'axios';
import '../css/BuyForm.css';

const BuyForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = location.state || {};

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'COD'
  });

  useEffect(() => {
    if (!post) {
      navigate('/home');
    }
  }, [post, navigate]);

  useEffect(() => {
    if (post) {
      calculateTotal(quantity);
    }
  }, [quantity, post]);

  const calculateTotal = (qty) => {
    const pricePerUnit = post.price;
    setTotalPrice(pricePerUnit * qty);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const orderData = {
        buyer_id: user.user_id,
        seller_id: post.user_id,
        post_id: post.post_id,
        quantity,
        total_price: totalPrice,
        payment_method: formData.paymentMethod,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.zip}`,
        order_status: 'pending'
      };

      await axios.post('http://localhost:5000/api/transactions', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/home/transactions');
    } catch (error) {
      console.error('Order submission failed:', error);
    }
  };

  if (!post) {
    return <div className="buy-form-container">No post data available</div>;
  }

  return (
    <div className="buy-form-container">
      <h1 className="buy-form-title">Place Order</h1>
      <div className="buy-form-content">
        <form onSubmit={handleSubmit} className="buy-form">
          <h2 className="section-title">
            <FaShoppingCart className="icon" /> Order Summary
          </h2>
          <div className="order-summary">
            <div className="order-item">
              <span>Material: {post.material_name}</span>
              <span>Price: {post.price} per {post.unit}</span>
            </div>
            <div className="quantity-control">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, e.target.value))}
              />
              <span>{post.unit}</span>
            </div>
            <div className="order-total">
              <span>Total Price:</span>
              <span>{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <h2 className="section-title">
            <FaTruck className="icon" /> Shipping Information
          </h2>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h2 className="section-title">
            <FaCreditCard className="icon" /> Payment Information
          </h2>
          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Card">Credit/Debit Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyForm;