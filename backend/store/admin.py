from django.contrib import admin
from store.models import Product, Category, Gallery, Color, Size, Specification, Cart, CartOrder, CartOrderItem, Course, CourseCategory

class GalleryInline(admin.TabularInline):
    model = Gallery

class SpecificationInline(admin.TabularInline):
    model = Specification

class ColorInline(admin.TabularInline):
    model = Color

class SizeInline(admin.TabularInline):
    model = Size

class ProductAdmin(admin.ModelAdmin):
    inlines = [GalleryInline, SpecificationInline, ColorInline, SizeInline]
    list_display = ['title', 'price', 'category', 'shipping_fee', 'stock_qty', 'in_stock', 'views', 'featured']
    list_editable = ['featured']
    list_filter = ['date', 'category', 'in_stock']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'active']
    list_editable = ['active']
    search_fields = ['title']
    prepopulated_fields = {'slug': ('title',)}
    
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'category', 'instructor', 'status', 'created_at']
    list_editable = ['status']
    list_filter = ['created_at', 'category', 'status']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}

class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'active']
    list_editable = ['active']
    search_fields = ['title']
    prepopulated_fields = {'slug': ('title',)}

class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_items', 'total_price', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email']

class CartOrderAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__email', 'status']

class CartOrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'course', 'quantity', 'price']
    list_filter = ['order', 'course']
    search_fields = ['order__id', 'course__title']

# Register models with their respective admin classes
admin.site.register(Product, ProductAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(CourseCategory, CourseCategoryAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(CartOrder, CartOrderAdmin)
admin.site.register(CartOrderItem, CartOrderItemAdmin)
