from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Category model."""
    list_display = ['name', 'slug', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin configuration for Product model."""
    list_display = ['name', 'category', 'price', 'stock', 'is_available', 'is_featured', 'created_at']
    list_filter = ['is_available', 'is_featured', 'category', 'created_at']
    list_editable = ['price', 'stock', 'is_available', 'is_featured']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'description', 'category')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'stock', 'is_available')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Featured', {
            'fields': ('is_featured',)
        }),
    )
