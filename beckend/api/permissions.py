from rest_framework import permissions
from rest_framework.settings import api_settings


class IsOwnerObj(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        return bool (
            request.user.id == obj.user.id or request.method in permissions.SAFE_METHODS or request.user.is_superuser

        )


# class DetailPromiseMixin()