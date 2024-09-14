from django.urls import path,include
from . import views

urlpatterns = [
    path('near/', views.near_list),
    path('cite/', views.cite_list),
    path('region/', views.region_list),
    path('houses/', views.houses_list),
    path('in-room/', views.in_room_list),
    path('date-register/', views.book_register_list),
    path('room-type/', views.room_type_list),
    path('house-rules/', views.house_rules_list),
    path('in-the-territory/', views.in_the_territory_list),
    path('houses/<int:id>/', views.detail_house),
    path('accommodation-options/', views.accommodation_options_list),
    path('auth/',include('api.auth.urls')),
]
