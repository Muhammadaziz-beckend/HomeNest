from rest_framework import serializers
from main.models import (
    Accommodation_options,
    Bathroom,
    For_indoor_relaxation,
    House,
    City,
    House_rules,
    In_room,
    In_the_territory,
    Included_in_the_price,
    Kitchen_equipment,
    Near,
    Region,
    Yard_equipment,
    Room_images,
    Room_Type, BookRegister,
)


# количество комнат
class Room_TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room_Type
        fields = "__all__"


# Названия Города
class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = "__all__"


# область
class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = "__all__"


# Варианты размещения
class Accommodation_optionsSerializer(serializers.ModelSerializer):
    house_count = Accommodation_options.house_count

    class Meta:
        model = Accommodation_options
        fields = ['id', 'name', 'house_count']

    def get_house_count(self, obj):
        return obj.house_count


# В помещении
class In_roomSerializer(serializers.ModelSerializer):
    class Meta:
        model = In_room
        fields = "__all__"


# Правила дома
class House_rulesSerializer(serializers.ModelSerializer):
    class Meta:
        model = House_rules
        fields = "__all__"


# Рядом
class NearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Near
        fields = "__all__"


# На территории
class In_the_territorySerializer(serializers.ModelSerializer):
    class Meta:
        model = In_the_territory
        fields = "__all__"


# ванная комната
class BathroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bathroom
        fields = "__all__"


# ванная комната
class Included_in_the_priceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Included_in_the_price
        fields = "__all__"


# ванная комната
class For_indoor_relaxationSerializer(serializers.ModelSerializer):
    class Meta:
        model = For_indoor_relaxation
        fields = "__all__"


# Кухонное оборудование
class Kitchen_equipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kitchen_equipment
        fields = "__all__"


# Оснащение двора
class Yard_equipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Yard_equipment
        fields = "__all__"


# Оснащение двора
class RoomImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    image = serializers.ImageField()

    class Meta:
        model = Room_images
        fields = ["id", "image", "image_url"]

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None


class HousesSerializer(serializers.ModelSerializer):
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())
    region = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all())
    included_in_the_price = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Included_in_the_price.objects.all()
    )
    for_indoor_relaxation = serializers.PrimaryKeyRelatedField(
        many=True, queryset=For_indoor_relaxation.objects.all()
    )
    kitchen_equipment = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Kitchen_equipment.objects.all()
    )
    yard_equipment = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Yard_equipment.objects.all()
    )
    images = RoomImageSerializer(many=True, required=False)

    class Meta:
        model = House
        fields = (
            "id",
            "images",
            "address",  # Первым идет адрес
            "street_number",  # Затем номер улицы
            "price",
            "city",
            "region",
            'in_room',
            "included_in_the_price",
            "for_indoor_relaxation",
            "kitchen_equipment",
            "yard_equipment",
            "bedrooms",
            'accommodation_options',
            "number_of_double_beds",
            "number_of_separate_beds",
            "total_area",
            "floors",
            "is_elevator",
            "room_type",
            "date_add",
        )

    def create(self, validated_data):
        images_data = self.context["request"].FILES.getlist(
            "images"
        )  # Получаем изображения из request.FILES
        included_in_the_price_data = validated_data.pop("included_in_the_price", [])
        for_indoor_relaxation_data = validated_data.pop("for_indoor_relaxation", [])
        kitchen_equipment_data = validated_data.pop("kitchen_equipment", [])
        yard_equipment_data = validated_data.pop("yard_equipment", [])

        # Создание объекта House
        house = House.objects.create(**validated_data)

        # Обработка связей ManyToMany
        house.included_in_the_price.set(included_in_the_price_data)
        house.for_indoor_relaxation.set(for_indoor_relaxation_data)
        house.kitchen_equipment.set(kitchen_equipment_data)
        house.yard_equipment.set(yard_equipment_data)

        # Обработка изображений
        for image in images_data:
            Room_images.objects.create(house=house, image=image)

        return house


class HouseDetailSerializer(serializers.ModelSerializer):
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())
    region = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all())
    bathroom = BathroomSerializer(many=True)
    included_in_the_price = Included_in_the_priceSerializer(many=True)
    for_indoor_relaxation = For_indoor_relaxationSerializer(many=True)
    kitchen_equipment = Kitchen_equipmentSerializer(many=True)
    yard_equipment = Yard_equipmentSerializer(many=True)
    images = RoomImageSerializer(many=True, read_only=True)

    class Meta:
        model = House
        fields = [
            "id",
            "images",
            "address",
            "street_number",
            "price",
            "city",
            'in_room',
            "region",
            "bathroom",
            "included_in_the_price",
            "for_indoor_relaxation",
            "kitchen_equipment",
            "yard_equipment",
            "bedrooms",
            "number_of_double_beds",
            "number_of_separate_beds",
            "total_area",
            'total_floors',
            "floors",
            'total_guests',
            "is_elevator",
            "descriptions1",
            "descriptions5",
            "room_type",
            "date_add",
        ]


# списак дат по поренде
class BookRegisterSerializer(serializers.ModelSerializer):

    home = HousesSerializer()
    result_prise = serializers.SerializerMethodField()  # Новое поле
    prise = serializers.SerializerMethodField()  # Новое поле


    class Meta:
        model = BookRegister
        fields = "__all__"

    def get_result_prise(self, obj):
        return obj.result_prise # Возвращаем результат метода

    def get_prise(self,obj):
        return obj.prise


from account.models import User

class CreateBookRegisterSerializer(serializers.ModelSerializer):

    home = serializers.PrimaryKeyRelatedField(queryset=House.objects.all())

    class Meta:
        model = BookRegister
        fields = ['data_start','data_end','home']

    def save(self, **kwargs):
        # Получаем пользователя из контекста запроса и передаем в save()
        kwargs['user'] = self.context['request'].user
        return super().save(**kwargs)