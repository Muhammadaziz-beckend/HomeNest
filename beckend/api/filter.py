import pprint
from django_filters import rest_framework as django_filters 
from main.models import House


class FilterHome(django_filters.FilterSet):

    price_from = django_filters.NumberFilter(lookup_expr="gte", field_name="price")
    price_to = django_filters.NumberFilter(lookup_expr="lte", field_name="price")

    is_elevator = django_filters.BooleanFilter(
        field_name="is_elevator", method="filter_is_elevator"
    )
    room_type = django_filters.NumberFilter(
        field_name="room_type", method="filter_room_type"
    )

    class Meta:
        model = House
        fields = [
            "accommodation_options",
            "room_type",
            "number_of_double_beds",
            "number_of_separate_beds",
            "near",
            "house_rules",
            "city",
            "region",
            "is_elevator",
            "in_room",
            "in_the_territory",
        ]

    def filter_is_elevator(self, queryset, name, value):

        queryset = House.objects.filter(is_elevator=value)
        return queryset

    def filter_room_type(self, queryset, name, value):

        queryset = House.objects.filter(room_type=value)

        return queryset

        # Вариант размещения + +
        # количество комнат +
        # Количество двуспальных кроватей +
        # Количество раздельных кроватей +
        # Рядом +
        # Правила дома +

        # Город +
        # Регион +

        # лифт+
        # В помещении +
        # на территории +
