from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework import serializers
from django.core.validators import MinValueValidator
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
import django
from datetime import date

from account.models import User
from api.serializers import RegionSerializer


class PetitionsByActive:
    permission_classes_by_active = {}

    def get_permissions(self):
        permission_classes = self.permission_classes_by_active.get(self.action, None)
        if self.action == "partial_update" or self.action == "update_partial":
            permission_classes = self.permission_classes_by_active.get("update", None)
        if permission_classes is None:
            permission_classes = self.permission_classes

        return [permission() for permission in permission_classes]


class MultipleDestroyMixinSerializer(serializers.Serializer):
    ids = serializers.ListSerializer(
        child=serializers.IntegerField(validators=[MinValueValidator(1)])
    )


class GetCiteMixinSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)


class GetCiteMixin:

    @action(methods=["POST"], detail=False, url_path="get-region-by-city")
    def get_region_id(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        queryset = self.get_queryset().filter(cite=serializer.data["id"])

        serialize = RegionSerializer(queryset, many=True)
        return Response(serialize.data)

    def get_serializer_class(self):
        path = self.request.path.split("/")[-2]

        if path == "get-region-by-city":
            return GetCiteMixinSerializer
        return super().get_serializer_class()


class MultipleDestroyMixin:
    multiple_delete_permission = permission_classes

    @permission_classes([multiple_delete_permission])
    @action(methods=["POST"], url_path="multiple-delete", detail=False)
    def multiple_delete(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        queryset = self.get_queryset()
        items = queryset.filter(id__in=serializer.data["ids"])
        not_deleted_items = []
        for item in items:
            item_id = item.id
            try:
                item.delete()
            except django.db.models.deletion.ProtectedError as e:
                not_deleted_items.append(item_id)
        return Response(
            {"not_deleted_items": not_deleted_items},
            status=(
                status.HTTP_204_NO_CONTENT
                if len(not_deleted_items) == 0
                else status.HTTP_423_LOCKED
            ),
        )

    def get_serializer_class(self):
        path = self.request.path.split("/")[-2]
        if path == "multiple-delete":
            return MultipleDestroyMixinSerializer
        return super().get_serializer_class()


class PublicThisYear:

    @action(["GET"], False, "public-this-year")
    def public_this_year(self, request):
        year = request.GET.get("year", None)
        create_year = year if year else date.today().year
        queryset = self.get_queryset().filter(date_add__year=create_year)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PaginationGetAllMixin:

    @action(["GET"], False, "all-items")
    def all_items(self, request):
        queryset = self.filter_queryset(self.get_queryset().filter(user=request.user))

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset().filter(user=request.user))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class SerializerByMethodMixin:
    serializer_classes = {}

    def get_serializer_class(self):
        if self.action == 'partial_update' or self.action == 'update_partial':
            return self.serializer_classes.get('update', self.serializer_class)
        return self.serializer_classes.get(self.action, self.serializer_class)

class SetUserProduct:
    user_create_product = False

    def perform_create(self, serializer):
        if self.user_create_product:
            user =  User.objects.get(phone=self.request.user.phone)
            serializer.save(user=user)
        else:
            serializer.save()

class ModelViewSetModification(
    SetUserProduct,MultipleDestroyMixin, PublicThisYear, PetitionsByActive, ModelViewSet
):
    pass
