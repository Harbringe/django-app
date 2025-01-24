from django.db import models
from django.utils.text import slugify

from userauths.models import User   

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, help_text="Tutor's Name", null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.FileField(upload_to='vendor', null=True, blank=True, default='vendor.jpg')
    mobile = models.CharField(max_length=100, null=True, blank=True, help_text="Tutor's Mobile Number")
    active = models.BooleanField(default=False)
    slug = models.SlugField(unique=True, max_length=500)


    class Meta:
        verbose_name_plural = 'Vendors'
        ordering = ['created_at']

    def __str__(self):
        return str(self.name)
    
    def save(self, *args, **kwargs):
        if self.slug == None or self.slug == '':
            self.slug = slugify(self.name)
        super(Vendor, self).save(*args, **kwargs)
