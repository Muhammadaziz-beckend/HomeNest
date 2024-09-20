from django.urls import  path
from .views import login_api,register_api,UpdateUser,logout
from api.views import BookRegisterUser

urlpatterns = [
    path('register/',register_api),
    path('login/',login_api),
    path('logout/',logout),
    path('update/',UpdateUser.as_view()),
    path('book-register-user/<int:id>/',BookRegisterUser.as_view())
]

