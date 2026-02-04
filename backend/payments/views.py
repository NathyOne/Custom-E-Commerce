import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from orders.models import Order
from products.models import Product


class InitializePaymentView(APIView):
    """Initialize Chapa payment for an order."""

    def post(self, request):
        """Create Chapa checkout session."""
        tx_ref = request.data.get('tx_ref')
        
        if not tx_ref:
            return Response(
                {'error': 'Transaction reference required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            order = Order.objects.get(tx_ref=tx_ref)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if order.status != 'pending':
            return Response(
                {'error': 'Order already processed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prepare Chapa payment data
        payload = {
            'amount': str(order.total_amount),
            'currency': 'ETB',
            'email': order.email,
            'first_name': order.first_name,
            'last_name': order.last_name,
            'phone_number': order.phone,
            'tx_ref': order.tx_ref,
            'callback_url': f"{settings.FRONTEND_URL}/api/payments/verify/",
            'return_url': f"{settings.FRONTEND_URL}/payment/success?tx_ref={order.tx_ref}",
            'customization': {
                'title': 'E-Commerce Store',
                'description': f'Payment for Order {order.order_number}'
            }
        }
        
        headers = {
            'Authorization': f'Bearer {settings.CHAPA_SECRET_KEY}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(
                f'{settings.CHAPA_API_URL}/transaction/initialize',
                json=payload,
                headers=headers,
                timeout=30
            )
            response_data = response.json()
            
            if response.status_code == 200 and response_data.get('status') == 'success':
                return Response({
                    'checkout_url': response_data['data']['checkout_url'],
                    'tx_ref': order.tx_ref
                })
            else:
                return Response(
                    {'error': response_data.get('message', 'Payment initialization failed')},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except requests.RequestException as e:
            return Response(
                {'error': f'Payment service error: {str(e)}'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class VerifyPaymentView(APIView):
    """Verify Chapa payment status."""

    def get(self, request):
        """Verify payment by transaction reference."""
        tx_ref = request.query_params.get('tx_ref')
        
        if not tx_ref:
            return Response(
                {'error': 'Transaction reference required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            order = Order.objects.get(tx_ref=tx_ref)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # If already verified, return success
        if order.status == 'paid':
            return Response({
                'status': 'success',
                'order_number': order.order_number,
                'message': 'Payment already verified'
            })
        
        headers = {
            'Authorization': f'Bearer {settings.CHAPA_SECRET_KEY}'
        }
        
        try:
            response = requests.get(
                f'{settings.CHAPA_API_URL}/transaction/verify/{tx_ref}',
                headers=headers,
                timeout=30
            )
            response_data = response.json()
            
            if response.status_code == 200 and response_data.get('status') == 'success':
                payment_data = response_data.get('data', {})
                
                if payment_data.get('status') == 'success':
                    # Update order status
                    order.status = 'paid'
                    order.payment_ref = payment_data.get('reference', '')
                    order.save()
                    
                    # Reduce product stock
                    for item in order.items.all():
                        product = item.product
                        product.stock -= item.quantity
                        product.save()
                    
                    return Response({
                        'status': 'success',
                        'order_number': order.order_number,
                        'message': 'Payment verified successfully'
                    })
                else:
                    return Response({
                        'status': 'pending',
                        'message': 'Payment not yet completed'
                    })
            else:
                return Response(
                    {'error': response_data.get('message', 'Verification failed')},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except requests.RequestException as e:
            return Response(
                {'error': f'Verification service error: {str(e)}'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class WebhookView(APIView):
    """Handle Chapa webhook callbacks."""

    def post(self, request):
        """Process payment webhook from Chapa."""
        tx_ref = request.data.get('tx_ref') or request.data.get('trx_ref')
        status_value = request.data.get('status')
        
        if not tx_ref:
            return Response({'error': 'Invalid webhook data'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            order = Order.objects.get(tx_ref=tx_ref)
            
            if status_value == 'success' and order.status == 'pending':
                order.status = 'paid'
                order.payment_ref = request.data.get('reference', '')
                order.save()
                
                # Reduce product stock
                for item in order.items.all():
                    product = item.product
                    product.stock -= item.quantity
                    product.save()
            
            return Response({'status': 'received'})
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
