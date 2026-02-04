import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { selectCartItems, selectCartTotal, clearCart } from '../features/cart/cartSlice';
import { useCreateOrderMutation, useInitializePaymentMutation } from '../features/api/apiSlice';

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
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{t('checkout.shipping_info')}</h2>
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full px-3 py-2 border rounded" />
            <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full px-3 py-2 border rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email" className="w-full px-3 py-2 border rounded" />
            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full px-3 py-2 border rounded" />
          </div>

          <textarea name="address" required value={formData.address} onChange={handleChange} placeholder="Address" className="w-full px-3 py-2 border rounded" />

          <input type="text" name="city" required value={formData.city} onChange={handleChange} placeholder="City" className="w-full px-3 py-2 border rounded" />
        </form>
      </div>

      <aside className="bg-white p-6 rounded shadow-sm">
        <h2 className="font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3 mb-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-semibold text-lg mb-4">
          <span>{t('cart.total')}</span>
          <span>{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(totalAmount)}</span>
        </div>

        <p className="text-sm text-gray-500 mb-4">You will be redirected to Chapa to complete your payment securely.</p>

        <button type="submit" form="checkout-form" className="w-full bg-[var(--accent-color)] py-2 rounded font-semibold disabled:opacity-50" disabled={isOrdering || isProcessing}>{isOrdering || isProcessing ? 'Processing...' : t('checkout.pay_button')}</button>
      </aside>
    </div>
  );
}

export default Checkout;
