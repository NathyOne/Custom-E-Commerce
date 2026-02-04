import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  selectCartItems, 
  selectCartTotal 
} from '../features/cart/cartSlice';
import './Cart.css';

function Cart() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotal);

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <span className="empty-icon">🛒</span>
          <h2>{t('cart.empty')}</h2>
          <Link to="/products" className="start-shopping-btn">
            {t('home.shop_now')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>{t('cart.title')} ({cartItems.length})</h1>
        <button 
          className="clear-cart-btn"
          onClick={() => dispatch(clearCart())}
        >
          {t('cart.clear')}
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="item-placeholder">📦</div>
                )}
              </div>
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">
                  {new Intl.NumberFormat('en-ET', { 
                    style: 'currency', 
                    currency: 'ETB' 
                  }).format(item.price)}
                </p>
              </div>

              <div className="item-actions">
                <div className="quantity-controls">
                  <button 
                    onClick={() => dispatch(updateQuantity({ 
                      id: item.id, 
                      quantity: item.quantity - 1 
                    }))}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => dispatch(updateQuantity({ 
                      id: item.id, 
                      quantity: item.quantity + 1 
                    }))}
                  >
                    +
                  </button>
                </div>
                
                <div className="item-subtotal">
                  {new Intl.NumberFormat('en-ET', { 
                    style: 'currency', 
                    currency: 'ETB' 
                  }).format(item.price * item.quantity)}
                </div>

                <button 
                  className="remove-btn"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>{t('cart.subtotal')}</span>
            <span>
              {new Intl.NumberFormat('en-ET', { 
                style: 'currency', 
                currency: 'ETB' 
              }).format(totalAmount)}
            </span>
          </div>
          
          <div className="total-row">
            <span>{t('cart.total')}</span>
            <span className="total-amount">
              {new Intl.NumberFormat('en-ET', { 
                style: 'currency', 
                currency: 'ETB' 
              }).format(totalAmount)}
            </span>
          </div>

          <Link to="/checkout" className="checkout-btn">
            {t('cart.checkout')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
