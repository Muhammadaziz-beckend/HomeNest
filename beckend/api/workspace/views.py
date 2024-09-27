from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import *
from rest_framework.filters import SearchFilter, OrderingFilter


from workspace.models import Order
from account.models import User
from main.models import House

from .serializers import OrdersSerializer
from api.serializers import HousesSerializer

from .pagination import PaginatorClass

from api.mixin import ModelViewSetModification, PaginationGetAllMixin


class ListOrderAPIView(ListModelMixin, GenericAPIView):
    queryset = Order.objects.all()
    serializer_class = OrdersSerializer
    pagination_class = PaginatorClass
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):

        queryset = self.filter_queryset(self.get_queryset().filter(user=request.user))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class HousesSetView(PaginationGetAllMixin,ModelViewSetModification):
    queryset = House.objects.all()
    serializer_class = HousesSerializer
    pagination_class = PaginatorClass
    filter_backends = [SearchFilter, OrderingFilter]
    ordering = ['price','date_add']
    search_fields = [
        "price",
    ]
    lookup_field = 'id'
    
    permission_classes_by_active = {
        "create": [IsAuthenticated, IsAdminUser],
        "list": [AllowAny],
        "update": [IsAuthenticated, IsAdminUser],
        "retrieve": [AllowAny],
        "destroy": [IsAuthenticated, IsAdminUser],
    }
