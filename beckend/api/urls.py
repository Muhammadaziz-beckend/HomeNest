from django.urls import path,include
from . import views
from .yaml import urlpatterns as swagger
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('cite',views.CiteViewSet)
router.register('date-register',views.BookRegisterSetView)
router.register('region',views.RegionViewSet)
router.register('houses',views.HousesSetView)


urlpatterns = [
    path('near/', views.ListNearAPIView.as_view()),
    # path('region/', views.ListRegion.as_view()),
    # path('houses/', views.ListCreateHouses.as_view()),
    path('in-room/', views.ListIn_room.as_view()),
    path('room-type/', views.ListRoom_type.as_view()),
    path('house-rules/', views.ListHouseRulesAPIView.as_view()),
    path('in-the-territory/', views.ListIn_the_territory.as_view()),
    # path('houses/<int:id>/', views.DetailHouseAPIView.as_view()),
    path('accommodation-options/', views.ListAccommodation_options.as_view()),
    path('auth/',include('api.auth.urls')),
    path('workspace/',include('api.workspace.urls')),
    path('',include(router.urls)),
]


urlpatterns += swagger