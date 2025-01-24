from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.conf import settings

from userauths.models import User, Profile 
from vendor.models import Vendor
from shortuuid.django_fields import ShortUUIDField


class Category(models.Model):
    title = models.CharField(max_length=100)
    image = models.FileField(upload_to='category', null=True, blank=True, default='category.jpg')
    active = models.BooleanField(default=True)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = 'Category'
        ordering = ['title']

    def __str__(self):
        return str(self.title)


class Product(models.Model):

    STATUS = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('in_review', 'In Review'),
        ('archived', 'Archived'),
    )

    title = models.CharField(max_length=100)
    image = models.FileField(upload_to='products', null=True, blank=True, default='product.jpg')
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    old_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    shipping_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    stock_qty = models.IntegerField(default=1)
    in_stock = models.BooleanField(default=True)
    status = models.CharField(max_length=100, choices=STATUS, default='published')
    featured = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    pid = ShortUUIDField(unique=True, length=10, prefix='DIX', alphabet='abcdefghijklmnopqrstuvwxyz1234567890')
    slug = models.SlugField(unique=True, max_length=500)
    date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.slug == None or self.slug == '':
            self.slug = slugify(self.name)
        super(Product, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.title)


class Gallery(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.FileField(upload_to='products', default='product.jpg')
    active = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)
    gid = ShortUUIDField(unique=True, length=10, prefix='DIX', alphabet='abcdefghijklmnopqrstuvwxyz1234567890')

    def __str__(self):
        return str(self.product)
    
    class Meta:
        verbose_name_plural = 'Product Images'

class Specification(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    title = models.CharField(max_length=1000)
    description = models.TextField(max_length=1000)


    def __str__(self):
        return self.title
    
class Size(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=1000)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Color(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=1000)
    color_code = models.CharField(max_length=1000)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_items = models.IntegerField(default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart of {self.user.email}"
    

class CartOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.email}"


class CartOrderItem(models.Model):
    order = models.ForeignKey(CartOrder, on_delete=models.CASCADE)
    course = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.course.title} (x{self.quantity})"


class CourseCategory(models.Model):
    title = models.CharField(max_length=100)
    image = models.FileField(upload_to='course_category', null=True, blank=True, default='course_category.jpg')
    active = models.BooleanField(default=True)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = 'Course Categories'
        ordering = ['title']

    def __str__(self):
        return str(self.title)


class Course(models.Model):
    STATUS = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('in_review', 'In Review'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(CourseCategory, on_delete=models.CASCADE)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    slug = models.SlugField(unique=True)
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return str(self.title)

class CourseFaq(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    answer = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=False)
    email = models.EmailField(null=True, blank=True)

    def __str__(self):
        return self.question
    
    class Meta:
        verbose_name_plural = 'Course FAQs'



class Review(models.Model):

    RATING = (
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    )


    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    review = models.TextField()
    rating = models.PositiveIntegerField(choices=RATING, default=None)
    reply = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.product.title
    
    class Meta:
        verbose_name_plural = 'Reviews & Ratings'

    
    def profile(self):
        return Profile.objects.get(user=self.user)
    