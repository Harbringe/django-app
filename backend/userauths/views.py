from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

# Rest Framework imports
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

# Others
import json
import random

# Serializers
from userauths.serializer import MyTokenObtainPairSerializer, ProfileSerializer, RegisterSerializer, UserSerializer

# Models
from userauths.models import Profile, User

class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom view to handle JWT token retrieval using a custom serializer.
    """
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    """
    View to handle user registration.
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

@api_view(['GET'])
def getRoutes(request):
    """
    Returns a list of available API routes.
    """
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/',
        '/api/test/'
    ]
    return Response(routes)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    """
    Test endpoint for authenticated GET and POST requests.
    """
    if request.method == 'GET':
        data = f"Congratulations {request.user}, your API just responded to a GET request."
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        try:
            body = request.body.decode('utf-8')
            data = json.loads(body)
            if 'text' not in data:
                return Response("Invalid JSON data", status=status.HTTP_400_BAD_REQUEST)
            text = data.get('text')
            data = f'Congratulations, your API just responded to a POST request with text: {text}'
            return Response({'response': data}, status=status.HTTP_200_OK)
        except json.JSONDecodeError:
            return Response("Invalid JSON data", status=status.HTTP_400_BAD_REQUEST)
    return Response("Invalid JSON data", status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveAPIView):
    """
    View to retrieve user profile information by user ID.
    """
    permission_classes = (AllowAny,)
    serializer_class = ProfileSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        return profile

def generate_numeric_otp(length=7):
    """
    Generates a numeric OTP of the specified length.
    """
    otp = ''.join([str(random.randint(0, 9)) for _ in range(length)])
    return otp

class PasswordEmailVerify(generics.RetrieveAPIView):
    """
    View to handle password reset email verification.
    """
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def get_object(self):
        
        email = self.kwargs['email']
        user = User.objects.get(email=email)
        if user:
            user.otp = generate_numeric_otp()
            user.save()
            uidb64 = user.pk

            # Generate reset token
            refresh = RefreshToken.for_user(user)
            reset_token = str(refresh.access_token)

            # Store token in the user model
            user.reset_token = reset_token
            user.save()

            link = f"http://localhost:5173/create-new-password?otp={user.otp}&uidb64={uidb64}"
            # merge_data = {
            #     'link': link,
            #     'username': user.username,
            # }
            # subject = "Password Reset Request"
            # text_body = render_to_string("email/password_reset.txt", merge_data)
            # html_body = render_to_string("email/password_reset.html", merge_data)

            # # Send email
            # msg = EmailMultiAlternatives(
            #     subject=subject, from_email=settings.FROM_EMAIL,
            #     to=[user.email], body=text_body
            # )
            # msg.attach_alternative(html_body, "text/html")
            # msg.send()

            print(f"Reset Link: {link}")
        return user

class PasswordChangeView(generics.CreateAPIView):
    """
    View to handle password change requests.
    """
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        """
        Handles password change requests.

        Expects the following data in the request body:

        - otp: The one time password sent to the user's email.
        - uidb64: The base64 encoded user ID.
        - reset_token: The reset token used to verify the request.
        - password: The new password to be set.
        Returns a successful response if the password change is successful,
        otherwise returns a 500 error response with an error message.
        """

        payload = request.data
        otp = payload['otp']
        uidb64 = payload['uidb64']
        reset_token = payload['reset_token']
        password = payload['password']

        user = User.objects.get(id=uidb64, otp=otp)
        if user:
            user.set_password(password)
            user.otp = ""
            user.reset_token = ""
            user.save()
            return Response({"message": "Password Changed Successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "An Error Occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
