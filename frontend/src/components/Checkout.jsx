import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { selectCartItems, selectCartTotal, clearCart } from '../features/cart/cartSlice';
import { useCreateOrderMutation, useInitializePaymentMutation } from '../features/api/apiSlice';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotal);
  
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();
  const [initializePayment, { isLoading: isProcessing }] = useInitializePaymentMutation();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Create Order
      const orderData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      const order = await createOrder(orderData).unwrap();
      
      // 2. Initialize Payment
      const payment = await initializePayment({
        tx_ref: order.tx_ref
      }).unwrap();
      
      // 3. Clear Cart and Redirect
      dispatch(clearCart());
      window.location.href = payment.checkout_url;
      
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-container">
      <div className="checkout-grid">
        <div className="checkout-form-section">
          <h2>{t('checkout.shipping_info')}</h2>
          <form id="checkout-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  required 
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  required 
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea 
                name="address" 
                required 
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label>City</label>
              <input 
                type="text" 
                name="city" 
                required 
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>

        <div className="checkout-summary-section">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.quantity}x {item.name}</span>
                <span>
                  {new Intl.NumberFormat('en-ET', { 
                    style: 'currency', 
                    currency: 'ETB' 
                  }).format(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="summary-total">
            <span>{t('cart.total')}</span>
            <span>
              {new Intl.NumberFormat('en-ET', { 
                style: 'currency', 
                currency: 'ETB' 
              }).format(totalAmount)}
            </span>
          </div>

          <div className="payment-note">
            <p>You will be redirected to Chapa to complete your payment securedly.</p>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            className="pay-btn"
            disabled={isOrdering || isProcessing}
          >
            {isOrdering || isProcessing ? 'Processing...' : t('checkout.pay_button')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
