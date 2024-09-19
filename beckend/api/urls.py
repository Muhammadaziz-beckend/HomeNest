from django.urls import path,include
from . import views

urlpatterns = [
    path('near/', views.near_list),
    path('cite/', views.cite_list),
    path('region/', views.ListRegion.as_view()),
    path('houses/', views.ListCreateHouses.as_view()),
    path('in-room/', views.ListIn_room.as_view()),
    path('date-register/', views.book_register_list),
    path('room-type/', views.ListRoom_type.as_view()),
    path('house-rules/', views.house_rules_list),
    path('in-the-territory/', views.ListIn_the_territory.as_view()),
    path('houses/<int:id>/', views.detail_house),
    path('accommodation-options/', views.ListAccommodation_options.as_view()),
    path('auth/',include('api.auth.urls')),
]
