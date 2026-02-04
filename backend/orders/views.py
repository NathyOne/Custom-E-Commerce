from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from products.models import Product


class OrderViewSet(viewsets.ViewSet):
    """ViewSet for managing orders."""

    def create(self, request):
        """Create a new order."""
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Create order
        order = Order.objects.create(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data['phone'],
            address=data['address'],
            city=data['city']
        )
        
        # Create order items
        total = 0
        for item_data in data['items']:
            product = get_object_or_404(Product, id=item_data['product_id'])
            quantity = item_data['quantity']
            
            # Check stock
            if product.stock < quantity:
                order.delete()
                return Response(
                    {'error': f'Not enough stock for {product.name}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price
            )
            total += product.price * quantity
        
        order.total_amount = total
        order.save()
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        """Get order by order number or tx_ref."""
        order = Order.objects.filter(order_number=pk).first() or \
                Order.objects.filter(tx_ref=pk).first()
        
        if not order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=['get'])
    def by_email(self, request):
        """Get orders by email address."""
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)
        
        orders = Order.objects.filter(email=email)
        return Response(OrderSerializer(orders, many=True).data)
