from django.core.serializers import serialize
from django.shortcuts import render
from django.db import models
from django.db.models import Q
from django.core.paginator import Paginator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404, GenericAPIView
from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.response import Response
from .filter import FilterHome
from rest_framework.permissions import IsAuthenticated
from api.auth.permissions import Reade_or_Post
from rest_framework.authtoken.models import Token
from django.utils.translation import gettext_lazy as _
from datetime import datetime
import json

from main.models import (
    House,
    City,
    Region,
    Room_Type,
    Accommodation_options,
    In_room,
    In_the_territory,
    Near,
    House_rules,
    BookRegister,
)
from .serializers import (
    HousesSerializer,
    HouseDetailSerializer,
    CitySerializer,
    RegionSerializer,
    Room_TypeSerializer,
    Accommodation_optionsSerializer,
    In_roomSerializer,
    In_the_territorySerializer,
    NearSerializer,
    House_rulesSerializer,
    BookRegisterSerializer,
    CreateBookRegisterSerializer,
)
from account.models import User
from rest_framework.status import *
from .clone import clone_house
from .pagination import PaginatorClass
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework.backends import DjangoFilterBackend


class ListCreateHouses(GenericAPIView):
    queryset = House.objects.all()
    serializer_class = HousesSerializer
    lookup_field = "id"
    search_fields = [
        "room_type",
        "city",
        "is_elevator",
    ]
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    ordering = ["price", "address", "date_add"]
    filter_class = FilterHome
    pagination_class = PaginatorClass
    permission_classes = [Reade_or_Post]

    def get(self, request, *args, **kwargs):
        count = self.get_queryset().count()
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


# @api_view(["GET", "PATCH"])
# @permission_classes([Reade_or_Post])
# def detail_house(req, id):
# house = get_object_or_404(House, id=id)

# if req.method == "PATCH":
#     serializer = HousesSerializer(
#         instance=house, data=req.data, context={"request": req}, partial=True
#     )
#     serializer.is_valid(raise_exception=True)
#     house = serializer.save()
#     read_serializer = HouseDetailSerializer(
#         instance=house, context={"request": req}
#     )
#     return Response(read_serializer.data)

# serializer = HouseDetailSerializer(instance=house, context={"request": req})

# return Response(serializer.data)


class DetailHouseAPIView(UpdateModelMixin, GenericAPIView):
    queryset = House.objects.all()
    serializer_class = HouseDetailSerializer
    permission_classes = [Reade_or_Post]
    lookup_field = "id"

    def get(self, request, id, *args, **kwargs):
        house = get_object_or_404(House, id=id)

        serializer = HouseDetailSerializer(instance=house, context={"request": request})

        return Response(serializer.data)

    def patch(self, request,id, *args, **kwargs):
        house = get_object_or_404(House, id=id)

        serializer = self.get_serializer(
            instance=house, data=request.data, context={"request": request}, partial=True
        )
        serializer.is_valid(raise_exception=True)
        house = serializer.save()
        read_serializer = self.get_serializer(
            instance=house, context={"request": request}
        )
        return Response(read_serializer.data)


# @api_view(["GET", "POST"])
# @permission_classes([Reade_or_Post])
# def cite_list(req):
# cites = City.objects.all()

# if req.method == "POST":
#     serializer = CitySerializer(data=req.data)
#     serializer.is_valid(raise_exception=True)
#     cites = serializer.save()

#     return Response(cites.data, status=HTTP_201_CREATED)

# serializer = CitySerializer(cites, context={"request": req}, many=True)

# return Response(serializer.data)


class ListCiteAPIView(ListModelMixin, CreateModelMixin, GenericAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [Reade_or_Post]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class ListRegion(GenericAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

    def get(self, request, *args, **kwargs):
        region = self.get_queryset()

        serializer = self.get_serializer(
            region, context={"request": request}, many=True
        )

        return Response(serializer.data)


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


# @api_view()
# def near_list(req):
# near = Near.objects.all()

# serializer = NearSerializer(near, many=True, context={"request": req})

# return Response(serializer.data)


class ListNearAPIView(ListModelMixin, GenericAPIView):
    queryset = Near.objects.all()
    serializer_class = NearSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


# @api_view()
# def house_rules_list(req):
# house_rules = House_rules.objects.all()

# serializer = House_rulesSerializer(house_rules, many=True, context={"request": req})

# return Response(serializer.data)


class ListHouseRulesAPIView(ListModelMixin, GenericAPIView):
    queryset = House_rules.objects.all()
    serializer_class = House_rulesSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class BookRegisterUser(CreateModelMixin, GenericAPIView):
    queryset = BookRegister.objects
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


class ListBookRegister(ListModelMixin, GenericAPIView):
    queryset = BookRegister.objects.all()
    serializer_class = BookRegisterSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class GetBookRegister(RetrieveModelMixin, GenericAPIView):
    queryset = House.objects.all()
    serializer_class = HouseDetailSerializer
    lookup_field = "id"

    def get(self, request, id, *args, **kwargs):

        house = get_object_or_404(self.get_queryset(), id=id)

        book_registers = house.book_register

        book_reg = CreateBookRegisterSerializer(book_registers, many=True)

        return Response(book_reg.data)
