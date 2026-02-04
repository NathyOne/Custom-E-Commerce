from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_available=True).count()


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 
            'category', 'category_name', 'image', 'stock', 
            'is_available', 'is_featured', 'in_stock', 'created_at'
        ]


class ProductDetailSerializer(ProductSerializer):
    """Detailed serializer for single product view."""
    category = CategorySerializer(read_only=True)
    related_products = serializers.SerializerMethodField()

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['related_products']

    def get_related_products(self, obj):
        related = Product.objects.filter(
            category=obj.category, 
            is_available=True
        ).exclude(id=obj.id)[:4]
        return ProductSerializer(related, many=True).data
