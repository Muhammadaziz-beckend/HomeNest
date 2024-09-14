from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import LoginSerializer, ProfileUserSerializer, RegisterSerializer


@api_view(["POST"])
def login_api(req):

    serializer = LoginSerializer(data=req.data)
    serializer.is_valid(raise_exception=True)

    phone = serializer.validated_data.get("phone")
    password = serializer.validated_data.get("password")

    user = authenticate(phone=phone, password=password)

    if user:
        reade_serializer = ProfileUserSerializer(
            instance=user, context={"request": req}
        )

        token = Token.objects.get_or_create(user=user)[0].key

        date = {
            **reade_serializer.data,
            "token": token,
        }

        return Response(date)

    return Response(
        {"detail": "The user does not exist or the password is incorrect"},
        status.HTTP_401_UNAUTHORIZED,
    )


@api_view(["POST"])
def register_api(req):
    serializer = RegisterSerializer(data=req.data)

    serializer.is_valid(raise_exception=True)

    user = serializer.save()

    reade_serializer = ProfileUserSerializer(instance=user, context={"request": req})

    token = Token.objects.get_or_create(user=user)[0].key

    date = {
        **reade_serializer.data,
        "token": token,
    }

    return Response(date,status=status.HTTP_201_CREATED)
