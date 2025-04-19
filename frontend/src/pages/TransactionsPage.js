// frontend/src/pages/TransactionsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import axios from 'axios';
import '../css/TransactionPage.css';

const TransactionsPage = () => {
  const [ordersReceived, setOrdersReceived] = useState([]);
  const [ordersPlaced, setOrdersPlaced] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));

                const [receivedRes, placedRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/transactions/seller/${user.user_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_BASE_URL}/api/transactions/buyer/${user.user_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setOrdersReceived(receivedRes.data);
                setOrdersPlaced(placedRes.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const handleStatusUpdate = async (transactionId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${API_BASE_URL}/api/transactions/${transactionId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrdersReceived(prev => prev.map(order =>
                order.transaction_id === transactionId
                    ? {...order, order_status: newStatus }
                    : order
            ));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

  
  const handleContact = (chatId) => {
    navigate('/home/chats', { state: { chatId } });
  };
  
  const handleDeleteOrder = async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrdersPlaced(prev => prev.filter(order => order.transaction_id !== transactionId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  if (loading) {
    return <div className="transaction-page">Loading...</div>;
  }

  return (
    <div className="transaction-page">
      <h1 className="page-title">My Transactions</h1>
      
      <div className="transaction-sections">
        {/* Orders Received (Seller) */}
        <div className="transaction-section">
          <h2>Orders Received</h2>
          {ordersReceived.length === 0 ? (
            <p>No orders received yet</p>
          ) : (
            <div className="order-list">
              {ordersReceived.map(order => (
                <div key={order.transaction_id} className="order-card">
                  <div className="order-info">
                    <h3>{order.material_name}</h3>
                    <div className="buyer-details">
                      <h4>Buyer Information:</h4>
                      <p><strong>Name:</strong> {order.buyer_name}</p>
                      <p><strong>Email:</strong> {order.buyer_email}</p>
                      <p><strong>Phone:</strong> {order.buyer_phone}</p>
                      <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
                    </div>
                    <div className="order-details">
                      <p><strong>Quantity:</strong> {order.quantity} {order.unit}</p>
                      <p><strong>Total Price:</strong> ${order.total_price}</p>
                      <p><strong>Status:</strong> <span className={`status-${order.order_status}`}>
                        {order.order_status}
                      </span></p>
                      <p><strong>Payment Method:</strong> {order.payment_method}</p>
                      <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="order-actions">
                    {order.order_status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(order.transaction_id, 'approved')}
                          className="btn-approve"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(order.transaction_id, 'rejected')}
                          className="btn-reject"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleContact(order.chat_id)}
                      className="btn-contact"
                    >
                      Contact Buyer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders Placed (Buyer) */}
        <div className="transaction-section">
          <h2>Orders Placed</h2>
          {ordersPlaced.length === 0 ? (
            <p>No orders placed yet</p>
          ) : (
            <div className="order-list">
              {ordersPlaced.map(order => (
                <div key={order.transaction_id} className="order-card">
                  <div className="order-info">
                    <h3>{order.material_name}</h3>
                    <div className="seller-details">
                      <h4>Seller Information:</h4>
                      <p><strong>Name:</strong> {order.seller_name}</p>
                      <p><strong>Email:</strong> {order.seller_email}</p>
                      <p><strong>Phone:</strong> {order.seller_phone}</p>
                    </div>
                    <div className="order-details">
                      <p><strong>Quantity:</strong> {order.quantity} {order.unit}</p>
                      <p><strong>Total Price:</strong> ${order.total_price}</p>
                      <p><strong>Status:</strong> <span className={`status-${order.order_status}`}>
                        {order.order_status}
                      </span></p>
                      <p><strong>Payment Method:</strong> {order.payment_method}</p>
                      <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
                      <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="order-actions">
                    <button 
                      onClick={() => handleDeleteOrder(order.transaction_id)}
                      className="btn-delete"
                    >
                      Cancel Order
                    </button>
                    <button 
                      onClick={() => handleContact(order.chat_id)}
                      className="btn-contact"
                    >
                      Contact Seller
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
