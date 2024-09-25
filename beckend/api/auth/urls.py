from django.urls import  path
from .views import LoginAPIView,RegisterAPIView,UpdateUser,logout,UpdatePasswordUser
from api.views import BookRegisterUser

urlpatterns = [
    path('register/',RegisterAPIView.as_view()),
    path('login/',LoginAPIView.as_view()),
    path('logout/',logout),
    path('update/<int:pk>/',UpdateUser.as_view()),
    path('chang_password/',UpdatePasswordUser.as_view()),
    path('book-register-user/<int:id>/',BookRegisterUser.as_view()),
]

