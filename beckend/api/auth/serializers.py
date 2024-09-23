from rest_framework import serializers
from account.models import User


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField()


class UpdatePasswordUserSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()
    

class UpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "email",  # +
            "last_name",
            "first_name",
        ]


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "phone",  # +
            "password",  # +
            "email",  # +
            "last_name",
            "first_name",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User(**validated_data)

        user.set_password(password)

        user.save()

        return user


class ProfileUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "get_full_name",
            "last_name",
            "first_name",
            "avatar",
            "phone",
            "email",
            "role",
        ]
