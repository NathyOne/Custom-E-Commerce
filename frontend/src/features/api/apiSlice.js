import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: ['Products', 'Categories', 'Orders'],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.category) searchParams.append('category', params.category);
        if (params.search) searchParams.append('search', params.search);
        if (params.ordering) searchParams.append('ordering', params.ordering);
        if (params.page) searchParams.append('page', params.page);
        return `products/?${searchParams.toString()}`;
      },
      providesTags: ['Products'],
    }),
    getProduct: builder.query({
      query: (slug) => `products/${slug}/`,
      providesTags: (result, error, slug) => [{ type: 'Products', id: slug }],
    }),
    getFeaturedProducts: builder.query({
      query: () => 'products/featured/',
      providesTags: ['Products'],
    }),
    // Categories
    getCategories: builder.query({
      query: () => 'products/categories/',
      providesTags: ['Categories'],
    }),
    // Orders
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: 'orders/',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders'],
    }),
    getOrder: builder.query({
      query: (orderNumber) => `orders/${orderNumber}/`,
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),
    // Payments
    initializePayment: builder.mutation({
      query: (data) => ({
        url: 'payments/initialize/',
        method: 'POST',
        body: data,
      }),
    }),
    verifyPayment: builder.query({
      query: (txRef) => `payments/verify/?tx_ref=${txRef}`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetFeaturedProductsQuery,
  useGetCategoriesQuery,
  useCreateOrderMutation,
  useGetOrderQuery,
  useInitializePaymentMutation,
  useVerifyPaymentQuery,
} = apiSlice;
