import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetProductsQuery, useGetCategoriesQuery } from '../features/api/apiSlice';
import ProductCard from './ProductCard';

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
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1 bg-white p-4 rounded shadow-sm">
        <div className="mb-4">
          <input
            type="text"
            placeholder={t('products.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Categories</h3>
          <button
            className={`w-full text-left px-3 py-2 rounded mb-2 ${!selectedCategory ? 'bg-[var(--primary-color)] text-white' : 'bg-white border'}`}
            onClick={() => setSelectedCategory('')}
          >
            {t('products.all_categories')}
          </button>
          {categories?.map(category => (
            <button
              key={category.id}
              className={`w-full text-left px-3 py-2 mb-2 rounded ${selectedCategory === category.slug ? 'bg-[var(--primary-color)] text-white' : 'bg-white border'}`}
              onClick={() => setSelectedCategory(category.slug)}
            >
              <div className="flex justify-between items-center">
                <span>{category.name}</span>
                <span className="text-sm text-gray-500">{category.product_count}</span>
              </div>
            </button>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-2">{t('products.sort_by')}</h3>
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="-created_at">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </aside>

      <section className="lg:col-span-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{selectedCategory ? `${selectedCategory.replace('-', ' ')}` : t('products.all_categories')}</h2>
          <span className="text-sm text-gray-500">{products.length} items</span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductList;
