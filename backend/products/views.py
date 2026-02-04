from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer, ProductDetailSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing categories."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing products."""
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products."""
        featured = self.queryset.filter(is_featured=True)[:8]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)
