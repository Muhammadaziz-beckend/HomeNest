import json
from django.core.serializers import serialize
from django.shortcuts import render
from django.db import models
from django.db.models import Q
from django.core.paginator import Paginator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404, GenericAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.response import Response
from .filter import FilterHome
from rest_framework.permissions import IsAuthenticated
from api.auth.permissions import Reade_or_Post
from rest_framework.mixins import ListModelMixin
from rest_framework.authtoken.models import Token
from django.utils.translation import gettext_lazy as _

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


# @api_view(["GET", "POST"])
# @permission_classes([Reade_or_Post])
# def houses_list(req):
# if req.method == "POST":
#     # clone_house(1,220) #для клонирования
#     serializer = HousesSerializer(data=req.data, context={"request": req})

#     if serializer.is_valid():
#         house = serializer.save()
#         resat_post = HousesSerializer(house, context={"request": req})
#         return Response(resat_post.data, status=HTTP_201_CREATED)
#     return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

# houses = House.objects.all()

# scorch = req.GET.get("scorch")

# if scorch:
#     houses.filter(
#         Q(address__icontains=scorch)
#         | Q(price=scorch)
#         | Q(descriptions1__icontains=scorch)
#     )

# filter = FilterHome(data=req.GET, request=houses)

# houses = filter.qs

# ordering = []  # надо сделать сортировку

# page = req.GET.get("page", 1)
# page_size = req.GET.get("limit", 7)

# paginator = Paginator(houses, page_size)
# count = houses.count()

# houses = paginator.get_page(page)

# serializer = HousesSerializer(houses, many=True, context={"request": req})

# # return Response(serializer.data) # без пагинации
# return Response(
#     {
#         "page": int(page),
#         "page_size": page_size,
#         "page_count": paginator.num_pages,
#         "count": count,
#         "data": serializer.data,
#     }
# )


@api_view(["GET", "PATCH"])
@permission_classes([Reade_or_Post])
def detail_house(req, id):
    house = get_object_or_404(House, id=id)

    if req.method == "PATCH":
        serializer = HousesSerializer(
            instance=house, data=req.data, context={"request": req}, partial=True
        )
        serializer.is_valid(raise_exception=True)
        house = serializer.save()
        read_serializer = HouseDetailSerializer(
            instance=house, context={"request": req}
        )
        return Response(read_serializer.data)

    serializer = HouseDetailSerializer(instance=house, context={"request": req})

    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([Reade_or_Post])
def cite_list(req):
    cites = City.objects.all()

    if req.method == "POST":
        serializer = CitySerializer(data=req.data)
        serializer.is_valid(raise_exception=True)
        cites = serializer.save()

        return Response(cites.data, status=HTTP_201_CREATED)

    serializer = CitySerializer(cites, context={"request": req}, many=True)

    return Response(serializer.data)


class ListRegion(GenericAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

    def get(self, request, *args, **kwargs):
        region = self.get_queryset()

        serializer = self.get_serializer(
            region, context={"request": request}, many=True
        )

        return Response(serializer.data)


# @api_view(["GET"])
# def region_list(req):
#     region = Region.objects.all()

#     serializer = RegionSerializer(region, context={"request": req}, many=True)

#     return Response(serializer.data)


# @api_view(["GET"])
# def room_type_list(req):
#     room_type = Room_Type.objects.all()

#     serializer = Room_TypeSerializer(room_type, context={"request": req}, many=True)

#     return Response(serializer.data)


class ListRoom_type(ListModelMixin, GenericAPIView):
    queryset = Room_Type.objects.all()
    serializer_class = Room_TypeSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


# @api_view()
# def accommodation_options_list(req):
#     accommodation_options: models = Accommodation_options.objects.all()

#     serializer = Accommodation_optionsSerializer(
#         accommodation_options, many=True, context={"request": req}
#     )

#     return Response(serializer.data)


class ListAccommodation_options(ListModelMixin, GenericAPIView):
    queryset = Accommodation_options.objects.all()
    serializer_class = Accommodation_optionsSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


# @api_view()
# def in_room_list(req):
#     in_room = In_room.objects.all()

#     serializer = In_roomSerializer(in_room, many=True, context={"request": req})

#     return Response(serializer.data)


class ListIn_room(ListModelMixin, GenericAPIView):
    queryset = In_room.objects.all()
    serializer_class = In_roomSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


# @api_view()
# def in_the_territory_list(req):
#     in_the_territory = In_the_territory.objects.all()

#     serializer = In_the_territorySerializer(
#         in_the_territory, many=True, context={"request": req}
#     )

#     return Response(serializer.data)


class ListIn_the_territory(ListModelMixin, GenericAPIView):
    queryset = In_the_territory.objects.all()
    serializer_class = In_the_territorySerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


@api_view()
def near_list(req):
    near = Near.objects.all()

    serializer = NearSerializer(near, many=True, context={"request": req})

    return Response(serializer.data)


@api_view()
def house_rules_list(req):
    house_rules = House_rules.objects.all()

    serializer = House_rulesSerializer(house_rules, many=True, context={"request": req})

    return Response(serializer.data)


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
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)


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

        date_start = request.data.get("data_start")
        date_end = request.data.get("data_end")
        home = request.data.get("home")

        resat = self.get_queryset().filter(
            Q(data_start__gte=date_start), Q(data_end__lt=date_end) | Q(home__pk=home)
        )

        if (resat) or (date_start > date_end):
            serializer = self.get_serializer(resat, many=True)
            return Response(
                (
                    {"detail": "data_start"}
                    if (date_start > date_end)
                    else {"detail": "data_include", "allDate": serializer.data}
                ),
                status=HTTP_400_BAD_REQUEST,
            )

        house_rules = serializer.save(user=id)
        read_book_register = self.get_serializer(house_rules)
        return Response(read_book_register.data, status=HTTP_201_CREATED)
    

    def get_serializer_class(self):
        assert self.serializer_classes is not None, (
            "'%s' should either include a `serializer_classes` attribute, "
            "or override the `get_serializer_class()` method." % self.__class__.__name__
        )

        method = self.request.method.lower()
        return self.serializer_classes[method]

    def get_read_serializer(self, *args, **kwargs):
        assert self.serializer_classes.get("get") is not None, (
            "'%s' should either include a serializer class for get method,"
            "if want to use read serializer, please set serializer class for get method"
            "or override the `get_serializer_class()` method." % self.__class__.__name__
        )
        serializer = self.serializer_classes.get("get")

        kwargs.setdefault("context", self.get_serializer_context())
        return serializer(*args, **kwargs)


# @api_view(["GET", "POST"])
@api_view(["GET"])
@permission_classes([Reade_or_Post])
def book_register_list(req):
    house_rules = BookRegister.objects.all()

    # if req.method == "POST":
    #     serializer = BookRegisterSerializer(data=req.data, context={"request": req})
    #     serializer.is_valid(raise_exception=True)

    #     date_start = req.data.get("data_start")
    #     date_end = req.data.get("data_end")
    #     home = req.data.get("home")

    #     resat = house_rules.filter(
    #         Q(data_start__gte=date_start), Q(data_end__lt=date_end) | Q(home__pk=home)
    #     )

    #     if (resat) or (date_start > date_end):
    #         serializer = BookRegisterSerializer(
    #             resat, many=True, context={"request": req}
    #         )
    #         return Response(
    #             (
    #                 {"error": "data_start"}
    #                 if (date_start > date_end)
    #                 else {"error": "data_include", "allDate": serializer.data}
    #             ),
    #             status=HTTP_400_BAD_REQUEST,
    #         )

    #     house_rules = serializer.save()
    #     read_book_register = BookRegisterSerializer(
    #         house_rules, context={"request": req}
    #     )
    #     return Response(read_book_register.data, status=HTTP_201_CREATED)

    serializer = BookRegisterSerializer(
        house_rules, many=True, context={"request": req}
    )

    return Response(serializer.data)
