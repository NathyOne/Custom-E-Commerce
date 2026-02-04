import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetProductsQuery, useGetCategoriesQuery } from '../features/api/apiSlice';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.results || [];
  
  const { data: productsData, isLoading, error } = useGetProductsQuery({
    category: selectedCategory,
    search,
    ordering
  });

  const products = productsData?.results || [];

  if (isLoading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error loading products</div>;

  return (
    <div className="product-list-container">
      <div className="filters-sidebar">
        <div className="search-box">
          <input
            type="text"
            placeholder={t('products.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <h3>Categories</h3>
          <button 
            className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            {t('products.all_categories')}
          </button>
          {categories?.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.slug ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.slug)}
            >
              {category.name}
              <span className="count-badge">{category.product_count}</span>
            </button>
          ))}
        </div>

        <div className="filter-group">
          <h3>{t('products.sort_by')}</h3>
          <select 
            value={ordering} 
            onChange={(e) => setOrdering(e.target.value)}
            className="sort-select"
          >
            <option value="-created_at">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>

      <div className="products-grid-section">
        <div className="products-header">
          <h2>{selectedCategory ? `${selectedCategory.replace('-', ' ')}` : t('products.all_categories')}</h2>
          <span className="products-count">{products.length} items</span>
        </div>
        
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
