import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useVerifyPaymentQuery } from '../features/api/apiSlice';
import { clearCart } from '../features/cart/cartSlice';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get('tx_ref');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  const { data, isLoading, error } = useVerifyPaymentQuery(txRef, {
    skip: !txRef,
  });

  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(clearCart());
    }
  }, [data, dispatch]);

  if (!txRef) {
    return (
      <div className="success-container error">
        <h2>Invalid Request</h2>
        <Link to="/" className="home-btn">{t('header.home')}</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="success-container loading">
        <div className="spinner"></div>
        <h2>{t('success.verifying')}</h2>
      </div>
    );
  }

  if (error || data?.status !== 'success') {
    return (
      <div className="success-container error">
        <h2>{t('success.failed')}</h2>
        <p>{t('success.failed_msg')}</p>
        <Link to="/" className="home-btn">{t('header.home')}</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-sm text-center max-w-md">
        <div className="text-6xl">🎉</div>
        <h1 className="text-2xl font-bold mt-4">{t('success.title')}</h1>
        <p className="mt-2 text-gray-700">{t('success.message')}</p>

        <div className="mt-4 text-left bg-gray-100 p-4 rounded">
          <p>{t('success.order_number')}: <strong>{data.order_number}</strong></p>
          <p>{t('success.tx_ref')}: <strong>{txRef}</strong></p>
        </div>

        <Link to="/" className="inline-block mt-4 bg-[var(--accent-color)] px-4 py-2 rounded">{t('success.continue_shopping')}</Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;
