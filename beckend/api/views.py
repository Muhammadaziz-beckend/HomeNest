from django.core.serializers import serialize
from django.shortcuts import render
from django.db import models
from django.db.models import Q
from django.core.paginator import Paginator
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.generics import get_object_or_404, GenericAPIView
from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.response import Response
from .filter import FilterHome
from rest_framework.permissions import *
from api.auth.permissions import Reade_or_Post
from rest_framework.authtoken.models import Token
from django.utils.translation import gettext_lazy as _
from .permissions import *
from .mixin import (
    GetCiteMixin,
    ModelViewSetModification,
    MultipleDestroyMixin,
    SerializerByMethodMixin,
)

from main.models import (
    Bathroom,
    For_indoor_relaxation,
    House,
    City,
    Included_in_the_price,
    Kitchen_equipment,
    Region,
    Room_Type,
    Accommodation_options,
    In_room,
    In_the_territory,
    Near,
    House_rules,
    BookRegister,
    Yard_equipment,
)
from .serializers import (
    BathroomSerializer,
    For_indoor_relaxationSerializer,
    HousesCreateSerializer,
    HousesSerializer,
    HouseDetailSerializer,
    CitySerializer,
    Included_in_the_priceSerializer,
    Kitchen_equipmentSerializer,
    RegionSerializer,
    Room_TypeSerializer,
    Accommodation_optionsSerializer,
    In_roomSerializer,
    In_the_territorySerializer,
    NearSerializer,
    House_rulesSerializer,
    BookRegisterSerializer,
    CreateBookRegisterSerializer,
    Yard_equipmentSerializer,
)
from account.models import User
from rest_framework.status import *
from .clone import clone_house
from .pagination import PaginatorClass
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet


class HousesSetView(SerializerByMethodMixin, ModelViewSetModification):
    queryset = House.objects.all()
    serializer_classes = {
        "list": HousesSerializer,
        "retrieve": HouseDetailSerializer,
        "create": HousesCreateSerializer,
        "update": HousesCreateSerializer,
    }
    lookup_field = "id"
    search_fields = [
        "room_type",
        "city",
        "is_elevator",
    ]
    user_create_product = True
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    ordering = ["price", "address", "date_add"]
    filter_class = FilterHome
    pagination_class = PaginatorClass
    permission_classes_by_active = {
        "create": [IsAuthenticated, IsAdminUser],
        "list": [AllowAny],
        "update": [IsOwnerObj, IsAdminUser],
        "retrieve": [AllowAny],
        "destroy": [IsOwnerObj, IsAdminUser],
    }
    lookup_field = "id"

    def perform_create(self, serializer):
        return super().perform_create(serializer)

    def list(self, request, *args, **kwargs):
        
        count = self.get_queryset().count()
        # clone_house(1,10)
        houses = self.filter_class(request.GET, self.get_queryset())
        if houses.is_valid():
            houses = houses.qs
        else:
            houses = self.get_queryset()
        
        pagination = self.pagination_class()
        pagination_houses = pagination.paginate_queryset(houses, request, self)

        serializer = self.get_serializer(pagination_houses, many=True)
        return Response(
            {
                "page": int(pagination.page.number),
                "page_size": pagination.page.paginator.per_page,
                "page_count": pagination.page.paginator.num_pages,
                "count": count,
                "data": serializer.data,
            }
        )
    
    def retrieve(self, request, *args, **kwargs):
        # houses = self.get_queryset().first()
        # print(houses.id,houses)
        # clone_house(houses.id,25)
        return super().retrieve(request, *args, **kwargs)



class CiteViewSet(MultipleDestroyMixin, ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [Reade_or_Post]

class IncludedInThePriceViewSet(ModelViewSet):
    queryset = Included_in_the_price.objects.all()
    serializer_class = Included_in_the_priceSerializer
    permission_classes = [Reade_or_Post]

class For_indoor_relaxationViewSet(ModelViewSet):
    queryset = For_indoor_relaxation.objects.all()
    serializer_class = For_indoor_relaxationSerializer
    permission_classes = [Reade_or_Post]

class KitchenEquipmentViewSet(ModelViewSet):
    queryset = Kitchen_equipment.objects.all()
    serializer_class = Kitchen_equipmentSerializer
    permission_classes = [Reade_or_Post]

class YardEquipmentViewSet(ModelViewSet):
    queryset = Yard_equipment.objects.all()
    serializer_class = Yard_equipmentSerializer
    permission_classes = [Reade_or_Post]

class BathroomViewSet(ModelViewSet):
    queryset = Bathroom.objects.all()
    serializer_class = BathroomSerializer
    permission_classes = [Reade_or_Post]

class RegionViewSet(GetCiteMixin, ReadOnlyModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    lookup_field = "id"
    permission_classes = [AllowAny]


class ListRoom_type(ListModelMixin, GenericAPIView):
    queryset = Room_Type.objects.all()
    serializer_class = Room_TypeSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class ListAccommodation_options(ListModelMixin, GenericAPIView):
    queryset = Accommodation_options.objects.all()
    serializer_class = Accommodation_optionsSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class ListIn_room(ListModelMixin, GenericAPIView):
    queryset = In_room.objects.all()
    serializer_class = In_roomSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class ListIn_the_territory(ListModelMixin, GenericAPIView):
    queryset = In_the_territory.objects.all()
    serializer_class = In_the_territorySerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)



class ListNearAPIView(ListModelMixin, GenericAPIView):
    queryset = Near.objects.all()
    serializer_class = NearSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class ListHouseRulesAPIView(ListModelMixin, GenericAPIView):
    queryset = House_rules.objects.all()
    serializer_class = House_rulesSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class BookRegisterUser(CreateModelMixin, GenericAPIView):
    queryset = BookRegister.objects.all().order_by("date_add")
    serializer_classes = {
        "get": BookRegisterSerializer,
        "post": CreateBookRegisterSerializer,
    }
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    pagination_class = PaginatorClass

    def get(self, request, id, *args, **kwargs):

        token = request.auth
        user = get_object_or_404(User, id=id)

        try:

            user_token = Token.objects.get(user=user)

            if token != user_token:
                return Response(
                    {"detail": ("Личность не подвержена")},
                    status=HTTP_401_UNAUTHORIZED,
                )

        except Exception as error:
            return Response(
                {
                    "detail": (
                        "Такова токена не существует"
                        if str(error) == "Token matching query does not exist."
                        else str(error)
                    )
                },
                status=HTTP_401_UNAUTHORIZED,
            )

        book_register = self.get_queryset().filter(user=user)

        book_register = self.paginate_queryset(book_register)

        serialize = self.get_serializer(book_register, many=True)

        return self.get_paginated_response(serialize.data)

    def post(self, request, id, *args, **kwargs):
        # Получаем сериализатор с данными из запроса
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Получаем токен аутентификации
        token = request.auth
        # Получаем пользователя по ID
        user = get_object_or_404(User, id=id)

        try:
            # Проверяем, существует ли токен для данного пользователя
            user_token = Token.objects.get(user=user)

            # Сравниваем токены
            if token != user_token:
                return Response(
                    {"detail": "Личность не подвержена"},
                    status=HTTP_401_UNAUTHORIZED,
                )

        except Token.DoesNotExist:
            return Response(
                {"detail": "Такого токена не существует"},
                status=HTTP_401_UNAUTHORIZED,
            )

        # Извлекаем даты начала и окончания, а также ID дома из запроса
        date_start = request.data.get("data_start")
        date_end = request.data.get("data_end")
        home = request.data.get("home")

        # Проверяем, есть ли уже существующие бронирования с пересекающимися датами
        resat = self.get_queryset().filter(
            Q(data_start__lte=date_end) & Q(data_end__gt=date_start) & Q(home__pk=home)
        )

        if resat or (date_start > date_end):

            for i in range(len(date_start) - 1):
                if date_start[i] > date_end[i]:
                    return Response(
                        {
                            "detail": (
                                "data_start"
                                if (date_start > date_end)
                                else "data_include"
                            ),
                            "allDate": serializer.data if resat else [],
                        },
                        status=HTTP_400_BAD_REQUEST,
                    )
                else:
                    break

        # Если все проверки пройдены, сохраняем бронирование
        house_rules = serializer.save(user=user)
        read_book_register = self.get_serializer(house_rules)
        return Response(read_book_register.data, status=HTTP_201_CREATED)

    def get_serializer_class(self):
        assert self.serializer_classes is not None, (
            "'%s' should either include a serializer_classes attribute, "
            "or override the get_serializer_class() method." % self.__class__.__name__
        )

        method = self.request.method.lower()
        return self.serializer_classes[method]

    def get_read_serializer(self, *args, **kwargs):
        assert self.serializer_classes.get("get") is not None, (
            "'%s' should either include a serializer class for get method,"
            "if want to use read serializer, please set serializer class for get method"
            "or override the get_serializer_class() method." % self.__class__.__name__
        )
        serializer = self.serializer_classes.get("get")

        kwargs.setdefault("context", self.get_serializer_context())
        return serializer(*args, **kwargs)


class BookRegisterSetView(ModelViewSetModification):
    queryset = BookRegister.objects.all()
    serializer_class = BookRegisterSerializer
    lookup_field = "id"
    permission_classes_by_active = {
        "create": [IsAuthenticated, IsAdminUser],
        "list": [AllowAny],
        "update": [IsAuthenticated, IsAdminUser],
        "retrieve": [AllowAny],
        "destroy": [IsAuthenticated, IsAdminUser],
    }

    def retrieve(self, request, id, *args, **kwargs):
        house = House.objects.get(id=id)

        book_register = house.book_register

        serializer = self.get_serializer(
            book_register,
            many=True,
        )

        return Response(serializer.data)
