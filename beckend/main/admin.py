from django.contrib import admin
from .models import *


@admin.register(Accommodation_options)
class Accommodation_optionsAdmin(admin.ModelAdmin):
    list_display = ("id", "name",'house_count')
    list_display_links = ("id", "name",'house_count')
    search_fields = ("name",)


@admin.register(In_room)
class In_roomAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)


@admin.register(House_rules)
class House_rulesAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)


@admin.register(In_the_territory)
class In_the_territoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)


@admin.register(Near)
class NearAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "cite")
    list_display_links = ("id", "name", "cite")
    search_fields = ("name",)
    list_filter = ("cite",)


@admin.register(Bathroom)
class BathroomAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)


@admin.register(Included_in_the_price)
class Included_in_the_priceAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)


@admin.register(For_indoor_relaxation)
class For_indoor_relaxationAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)


@admin.register(Kitchen_equipment)
class Kitchen_equipmentAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)


@admin.register(Yard_equipment)
class Yard_equipmentAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    search_fields = ("name",)


class PHouseImageStackedInline(admin.TabularInline):

    model = Room_images
    extra = 1
    max_num = 6


@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "room_type",
        "city",
        "region",
        "address",
        'accommodation_options',
        "price",
        "bedrooms",
        'total_guests',
        "number_of_double_beds",
        "total_area",
        "floors",
        'is_elevator',
    )
    list_display_links = (
        "id",
        "room_type",
        "city",
        "region",
        "address",
        'accommodation_options',
        "price",
        "bedrooms",
        'total_guests',
        "number_of_double_beds",
        "total_area",
        "floors",
    )
    list_editable = ("is_elevator",)
    search_fields = ("street_number", "price", "street_number", "address",)
    list_filter = ("city",'accommodation_options','near',"is_elevator")
    inlines = [PHouseImageStackedInline]


@admin.register(Room_Type)
class Room_TypeAdmin(admin.ModelAdmin):
    list_display = ('id','num')
    list_display_links = ('id','num')

@admin.register(Room_images)
class Room_imagesAdmin(admin.ModelAdmin):
    list_display = ('id','house__address')
    list_display_links = ('id','house__address')


@admin.register(BookRegister)
class BookRegisterAdmin(admin.ModelAdmin):
    list_display = ('id','data_start','data_end','result_prise', 'prise','home' ,'user__phone')
    list_display_links = ('id','data_start','data_end','result_prise','prise','home','user__phone')
    search_fields = ['user__first_name','user__phone']

    def result_prise(self, obj):
        return obj.result_prise

    result_prise.short_description = 'Итоговая цена' 

    def prise(self, obj):
        return obj.prise

    prise.short_description = 'цена' 