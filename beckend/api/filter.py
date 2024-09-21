import pprint
from django_filters import rest_framework as django_filters
from main.models import House, BookRegister


class FilterHome(django_filters.FilterSet):

    price_from = django_filters.NumberFilter(lookup_expr="gte", field_name="price")
    price_to = django_filters.NumberFilter(lookup_expr="lte", field_name="price")

    room_type = django_filters.NumberFilter(
        field_name="room_type", method="filter_room_type"
    )
    is_elevator = django_filters.BooleanFilter(
        field_name="is_elevator", method="filter_is_elevator"
    )

    class Meta:
        model = House
        fields = [
            "region",
            "room_type",
            "accommodation_options",
            "number_of_double_beds",
            "number_of_separate_beds",
            "is_elevator",
            "near",
            "house_rules",
            "in_room",
            "in_the_territory",
            "city",
        ]

    def filter_room_type(self, queryset, name, value):
        
        return queryset.filter(room_type=value)

    def filter_is_elevator(self, queryset, name, value):

        return queryset.filter(is_elevator=value)

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


# class FilterBookRegister(django_filters.FilterSet):

#     class Meta:
#         model = BookRegister
