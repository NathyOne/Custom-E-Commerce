from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model."""
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'subtotal']
        read_only_fields = ['price']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model."""
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'email', 'first_name', 'last_name',
            'phone', 'address', 'city', 'status', 'total_amount',
            'tx_ref', 'items', 'created_at'
        ]
        read_only_fields = ['order_number', 'status', 'total_amount', 'tx_ref']


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating a new order."""
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    items = serializers.ListField(
        child=serializers.DictField(),
        min_length=1
    )

    def validate_items(self, value):
        """Validate order items."""
        for item in value:
            if 'product_id' not in item or 'quantity' not in item:
                raise serializers.ValidationError("Each item must have product_id and quantity")
            if item['quantity'] < 1:
                raise serializers.ValidationError("Quantity must be at least 1")
        return value
