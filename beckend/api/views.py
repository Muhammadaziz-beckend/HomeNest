from django.core.serializers import serialize
from django.shortcuts import render
from django.db import models
from django.db.models import Q
from django.core.paginator import Paginator
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from .filter import FilterHome

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
)
from rest_framework.status import *
from .clone import clone_house


@api_view(["GET", "POST"])
def houses_list(req):
    if req.method == "POST":
        # clone_house(1,100) #для клонирования
        serializer = HousesSerializer(data=req.data, context={"request": req})

        if serializer.is_valid():
            house = serializer.save()
            resat_post = HousesSerializer(house, context={"request": req})
            return Response(resat_post.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    houses = House.objects.all()

    scorch = req.GET.get("scorch")

    if scorch:
        houses.filter(
            Q(address__icontains=scorch)
            | Q(price=scorch)
            | Q(descriptions1__icontains=scorch)
        )

    filter = FilterHome(data=req.GET,request=houses)

    houses = filter.qs

    ordering = []  # надо сделать сортировку

    page = req.GET.get("page", 1)
    page_size = req.GET.get("limit", 6)

    paginator = Paginator(houses, page_size)
    count = houses.count()

    houses = paginator.get_page(page)

    serializer = HousesSerializer(houses, many=True, context={"request": req})

    # return Response(serializer.data)
    return Response(
        {
            "page": page,
            "page_size": page_size,
            "page_count": paginator.num_pages,
            "count": count,
            "data": serializer.data,
        }
    )


@api_view(["GET", "PATCH"])
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
def cite_list(req):
    cites = City.objects.all()

    if req.method == "POST":
        serializer = CitySerializer(data=req.data)
        serializer.is_valid(raise_exception=True)
        cites = serializer.save()

        return Response(cites.data, status=HTTP_201_CREATED)

    serializer = CitySerializer(cites, context={"request": req}, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def region_list(req):
    region = Region.objects.all()

    serializer = RegionSerializer(region, context={"request": req}, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def room_type_list(req):
    room_type: Room_Type = Room_Type.objects.all()

    serializer = Room_TypeSerializer(room_type, context={"request": req}, many=True)

    return Response(serializer.data)


@api_view()
def accommodation_options_list(req):
    accommodation_options: models = Accommodation_options.objects.all()

    serializer = Accommodation_optionsSerializer(
        accommodation_options, many=True, context={"request": req}
    )

    return Response(serializer.data)


@api_view()
def in_room_list(req):
    in_room = In_room.objects.all()

    serializer = In_roomSerializer(in_room, many=True, context={"request": req})

    return Response(serializer.data)


@api_view()
def in_the_territory_list(req):
    in_the_territory = In_the_territory.objects.all()

    serializer = In_the_territorySerializer(
        in_the_territory, many=True, context={"request": req}
    )

    return Response(serializer.data)


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


@api_view(["GET", "POST"])
def book_register_list(req):
    house_rules = BookRegister.objects.all()

    if req.method == "POST":
        serializer = BookRegisterSerializer(data=req.data, context={"request": req})
        serializer.is_valid(raise_exception=True)

        date_start = req.data.get("data_start")
        date_end = req.data.get("data_end")
        home = req.data.get("home")

        resat = house_rules.filter(
            Q(data_start__gte=date_start), Q(data_end__lt=date_end) | Q(home__pk=home)
        )

        if (resat) or (date_start > date_end):
            serializer = BookRegisterSerializer(
                resat, many=True, context={"request": req}
            )
            return Response(
                (
                    {"error": "data_start"}
                    if (date_start > date_end)
                    else {"error": "data_include", "allDate": serializer.data}
                ),
                status=HTTP_400_BAD_REQUEST,
            )

        house_rules = serializer.save()
        read_book_register = BookRegisterSerializer(
            house_rules, context={"request": req}
        )
        return Response(read_book_register.data, status=HTTP_201_CREATED)

    serializer = BookRegisterSerializer(
        house_rules, many=True, context={"request": req}
    )

    return Response(serializer.data)
