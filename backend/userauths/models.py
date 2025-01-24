from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save

from shortuuid.django_fields import ShortUUIDField

# Create your models here.
class User(AbstractUser):
    """
    Custom User model that extends AbstractUser.
    
    Attributes:
        username (CharField): Unique username for the user.
        email (EmailField): Unique email address for the user.
        full_name (CharField): Full name of the user.
        phone (CharField): Phone number of the user.
    """
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    otp = models.CharField(max_length=15, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        """
        String representation of the User model.

        Returns:
            str: The email associated with the user.
        """
        return self.email

    def save(self, *args, **kwargs):
        
        """
        Custom save method for the User model.

        Automatically sets the username to the email without the domain if
        the username is not provided. Also sets the full_name to the username
        if the full_name is not provided.

        Args:

            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            None
        """
        email_username = self.email.split('@')[0]

        if self.full_name == '' or self.full_name is None:
            self.full_name = email_username

        if self.username == '' or self.username is None:
            self.username = email_username

        super(User, self).save(*args, **kwargs)



class Profile(models.Model):
    """
    Profile model that is linked to the User model.
    
    Attributes:
        user (OneToOneField): One-to-one relationship with the User model.
        image (FileField): Profile image of the user.
        full_name (CharField): Full name of the user.
        about (TextField): About section for the user.
        gender (CharField): Gender of the user.
        country (CharField): Country of the user.
        city (CharField): City of the user.
        address (CharField): Address of the user.
        state (CharField): State of the user.
        date (DateTimeField): Date when the profile was created.
        pid (ShortUUIDField): Unique profile ID.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to='profile_pics', null=True, blank=True, default="default/default-user.jpg")
    full_name = models.CharField(max_length=100, null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    gender = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    pid = ShortUUIDField(unique=True, length = 10, max_length=20, alphabet='abcdefghijklmnopqrstuvwxyz0123456789')

    def __str__(self):
        """
        String representation of the Profile model.

        Returns:
            str: The full name of the profile if available,
                otherwise the full name of the associated user.
        """

        if self.full_name:
            return str(self.full_name)
        else:
            return str(self.user.full_name)

    def save(self, *args, **kwargs):
        """
        Custom save method for the Profile model.

        Automatically sets the full_name to the full name of the associated
        user if the full_name is not provided.

        Args:

            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            None
        """
        if self.full_name == '' or self.full_name is None:
            self.full_name = self.user.full_name

        super(Profile, self).save(*args, **kwargs)



def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal handler to create a Profile instance when a User instance is created.

    Listens for the post_save signal from the User model and creates a Profile
    instance if the User instance is newly created.

    Args:

        sender: The User model class.
        instance: The User instance that triggered the signal.
        created: A boolean indicating whether the User instance was newly created.
        **kwargs: Additional keyword arguments.

    Returns:
        None
    """
    if created:
        Profile.objects.create(user=instance)
    
def save_user_profile(sender, instance, **kwargs):
    """
    Signal handler to save the Profile instance when the associated User instance
    is saved.

    Listens for the post_save signal from the User model and saves the associated
    Profile instance.

    Args:

        sender: The User model class.
        instance: The User instance that triggered the signal.
        **kwargs: Additional keyword arguments.

    Returns:
        None
    """
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)

