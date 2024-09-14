from django.urls import  path
from .views import login_api,register_api

urlpatterns = [
    path('register/',register_api),
    path('login/',login_api),
]
