from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from account.models import User
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from rest_framework.permissions import IsAuthenticated

from .serializers import (
    LoginSerializer,
    ProfileUserSerializer,
    RegisterSerializer,
    UpdatePasswordUserSerializer,
    UpdateSerializer,
)


@api_view(["POST"])
def logout(req):
    print(req)


@api_view(["POST"])
def login_api(req):

    serializer = LoginSerializer(data=req.data)
    print(req.data)
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

        print(date)

        return Response(date)

    return Response(
        {"detail": "Пользователь не существует или пароль неверен"},
        status.HTTP_401_UNAUTHORIZED,
    )


@api_view(["POST"])
def register_api(req):
    serializer = RegisterSerializer(data=req.data)
    print(req.data)

    phone_user_req = req.data.get("phone")

    if User.objects.filter(phone=phone_user_req):
        return Response(
            {"detail": "Такой телефон номер существует"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer.is_valid(raise_exception=True)

    user = serializer.save()

    reade_serializer = ProfileUserSerializer(instance=user, context={"request": req})

    token = Token.objects.get_or_create(user=user)[0].key

    date = {
        **reade_serializer.data,
        "token": token,
    }

    return Response(date, status=status.HTTP_201_CREATED)


class UpdateUser(APIView):

    def patch(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        serializer = UpdateSerializer(user, data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        reade_serializer = ProfileUserSerializer(
            instance=user, context={"request": request}
        )
        token = Token.objects.get_or_create(user=user)[0].key

        print(request)
        return Response(
            {
                **reade_serializer.data,
                "token": token,
            }
        )


class UpdatePasswordUser(GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UpdatePasswordUserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_password = serializer.validated_data.get("new_password")
        old_password = serializer.validated_data.get("old_password")

        user = authenticate(phone=request.user.phone, password=old_password)

        if user:

            user.set_password(new_password)
            user.save()

            return Response({"detail": "Пароль успешно изменён"})

        return Response({"detail": "Неверный старый пароль"}, status=status.HTTP_400_BAD_REQUEST)
