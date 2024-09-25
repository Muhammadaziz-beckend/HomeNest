from rest_framework.permissions import BasePermission


class Reade_or_Post(BasePermission):

    def has_permission(self, request, view):

        if request.user and request.user.is_authenticated:
            if request.method == "POST" or request.method == "PATCH":
                return True

        return request.method == "GET"
    
    
