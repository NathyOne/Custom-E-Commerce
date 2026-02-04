from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    """Inline admin for order items."""
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal']

    def subtotal(self, obj):
        return obj.subtotal


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin configuration for Order model."""
    list_display = ['order_number', 'email', 'first_name', 'last_name', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_number', 'email', 'first_name', 'last_name', 'phone']
    readonly_fields = ['order_number', 'tx_ref', 'payment_ref', 'created_at', 'updated_at']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'status', 'tx_ref', 'payment_ref')
        }),
        ('Customer Information', {
            'fields': ('email', 'first_name', 'last_name', 'phone')
        }),
        ('Shipping Address', {
            'fields': ('address', 'city')
        }),
        ('Payment', {
            'fields': ('total_amount',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
