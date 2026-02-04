import ProductList from '../components/ProductList';

function ProductPage() {
  return (
    <div className="page product-page">
      <div className="page-header">
        <h1>All Products</h1>
      </div>
      <ProductList />
    </div>
  );
}

export default ProductPage;
