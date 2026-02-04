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

function Cart() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotal);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl">🛒</div>
          <h2 className="text-xl font-semibold mt-4">{t('cart.empty')}</h2>
          <Link to="/products" className="inline-block mt-4 bg-[var(--accent-color)] px-4 py-2 rounded">{t('home.shop_now')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('cart.title')} ({cartItems.length})</h1>
        <button className="text-sm text-red-600" onClick={() => dispatch(clearCart())}>{t('cart.clear')}</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded shadow-sm">
              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div>📦</div>}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(item.price)}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 border rounded" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>-</button>
                  <span>{item.quantity}</span>
                  <button className="px-2 py-1 border rounded" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
                </div>

                <div className="text-sm font-semibold">{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(item.price * item.quantity)}</div>

                <button className="text-red-500" onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>{t('cart.subtotal')}</span>
            <span>{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(totalAmount)}</span>
          </div>

          <div className="flex justify-between font-bold text-lg mb-4">
            <span>{t('cart.total')}</span>
            <span>{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(totalAmount)}</span>
          </div>

          <Link to="/checkout" className="block text-center bg-[var(--accent-color)] py-2 rounded font-semibold">{t('cart.checkout')}</Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
