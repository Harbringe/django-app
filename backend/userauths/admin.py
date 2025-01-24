from django.contrib import admin
from userauths.models import Profile, User

class UserAdmin(admin.ModelAdmin):
    """
    Admin view for the User model.
    
    Attributes:
        list_display (list): Fields to display in the admin list view.
        search_fields (list): Fields to include in the search functionality.
    """
    list_display = ['email', 'full_name', 'phone']
    search_fields = ['email', 'full_name', 'phone']

class ProfileAdmin(admin.ModelAdmin):
    """
    Admin view for the Profile model.
    
    Attributes:
        list_display (list): Fields to display in the admin list view.
        search_fields (list): Fields to include in the search functionality.
        list_filter (list): Fields to include in the filter functionality.
    """
    list_display = ['full_name', 'gender', 'country', 'date']
    search_fields = ['full_name', 'country', 'date']
    list_filter = ['date']

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)