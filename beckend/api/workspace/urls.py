from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import ListOrderAPIView,HousesSetView

router = DefaultRouter()
router.register('house',HousesSetView)

urlpatterns = [
    path('orders/',ListOrderAPIView.as_view()),
    path('',include(router.urls))
]
