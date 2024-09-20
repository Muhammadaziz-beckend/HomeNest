from django.db import models
from django_resized import ResizedImageField
from account.models import User

# Дата
class DateModelAbstract(models.Model):
    date_add = models.DateField("Дата добавления", auto_now_add=True)
    date_now = models.DateField("Дата изменения", auto_now=True)

    class Meta:
        abstract = True


# Иконка
class ImageDes(DateModelAbstract):
    image = ResizedImageField("Иконка",size=[920, 600], upload_to="icon/", blank=True, null=True,quality=90, force_format='WEBP')

    class Meta:
        abstract = True


# Варианты размещения
class Accommodation_options(DateModelAbstract):
    name = models.CharField(verbose_name="Варианты размещения", max_length=50)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Вариант размещения"
        verbose_name_plural = "Варианты размещения"

    @property
    def house_count(self):
        """
        Возвращает количество домов, связанных с этим вариантом размещения.
        """
        return self.accommodation_options.count()


# В помещении
class In_room(ImageDes):
    name = models.CharField(verbose_name="В помещении", max_length=50)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "В помещении"
        verbose_name_plural = "В помещении"


# Правила дома
class House_rules(DateModelAbstract):
    name = models.CharField(verbose_name="Правила дома", max_length=50)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Правила дома"
        verbose_name_plural = "Правила домов"


# На территории
class In_the_territory(DateModelAbstract):
    name = models.CharField(verbose_name=("На территории"), max_length=50)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "На территории"
        verbose_name_plural = "На территории"


# Рядом
class Near(DateModelAbstract):
    name = models.CharField(verbose_name=("Рядом"), max_length=50)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Рядом"
        verbose_name_plural = "Рядом"


# Названия Города
class City(DateModelAbstract):
    name = models.CharField(("Названия Города"), max_length=50)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Названия Города"
        verbose_name_plural = "Названия Города"


# область
class Region(DateModelAbstract):
    name = models.CharField(verbose_name="Область", max_length=50)
    cite = models.ForeignKey(
        "City", verbose_name=("Выберите город"), on_delete=models.CASCADE
    )

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "область"
        verbose_name_plural = "области"


# ванная комната
class Bathroom(ImageDes):
    name = models.CharField(verbose_name=("ванная комната"), max_length=50)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "ванная комната"
        verbose_name_plural = "ванная комната"


# Входит в стоимость проживания
class Included_in_the_price(ImageDes):
    name = models.CharField(("Входит в стоимость проживания"), max_length=50)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Входит в стоимость проживания"
        verbose_name_plural = "Входит в стоимости проживании"


# Для отдыха в помещении
class For_indoor_relaxation(ImageDes):
    name = models.CharField(verbose_name=("Для отдыха в помещении "), max_length=50)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "отдыхе в помещении"
        verbose_name_plural = "отдыхе в помещении"


# Кухонное оборудование
class Kitchen_equipment(ImageDes):
    name = models.CharField(verbose_name=("Кухонное оборудование"), max_length=50)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "кухонное оборудование"
        verbose_name_plural = "кухонное оборудовании"

from django.utils.translation import gettext_lazy as _
# Оснащение двора
class Yard_equipment(ImageDes):
    name = models.CharField(verbose_name=("Оснащение двора"), max_length=50)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Оснащение двора"
        verbose_name_plural = "Оснащение дворов"


class House(DateModelAbstract):
    # дом
    user = models.ForeignKey(User,models.CASCADE,related_name='user_room',verbose_name=_('Владелец'))
    room_type = models.ForeignKey(
        "Room_Type",
        models.SET_NULL,
        null=True,
        related_name="room",
        verbose_name="количество комнат",
    )

    city = models.ForeignKey(
        "City", models.CASCADE, related_name="room_in", verbose_name="Город"
    )
    region = models.ForeignKey(
        to=Region,
        verbose_name="Регион",
        related_name="region",
        on_delete=models.CASCADE,
    )

    address = models.CharField("Название улицы", max_length=30)
    street_number = models.PositiveIntegerField("Номер улицы", default=1)
    accommodation_options = models.ForeignKey(
        to=Accommodation_options,
        on_delete=models.CASCADE,
        verbose_name="Вариант размещения",
        related_name="accommodation_options",
        null=True,
    )
    price = models.PositiveIntegerField("Цена за день", default=0)

    bedrooms = models.PositiveBigIntegerField(verbose_name="Количество спальни")
    number_of_double_beds = models.PositiveBigIntegerField(
        verbose_name="Количество двуспальных кроватей"
    )
    number_of_separate_beds = models.PositiveBigIntegerField(
        verbose_name="Количество раздельных кроватей"
    )
    total_area = models.PositiveBigIntegerField(verbose_name="общая площадь в м2")
    total_guests = models.PositiveBigIntegerField(
        verbose_name="общее количество гостей", default=2
    )
    total_floors = models.PositiveIntegerField(verbose_name="Всего этажей", default=1)
    floors = models.PositiveIntegerField(verbose_name=("этаж"), default=1)
    is_elevator = models.BooleanField(verbose_name="Есть лифт")

    # описания комнат
    descriptions1 = models.TextField(
        verbose_name="Описания (сколько комнат,какой ремонт,заезд и отъезд)",
        max_length=230,
    )
    bathroom = models.ManyToManyField(
        to=Bathroom, verbose_name="ванной комнаты (что есть?)", related_name="bathroom"
    )
    included_in_the_price = models.ManyToManyField(
        to=Included_in_the_price,
        verbose_name="Входит в стоимость проживания (что есть?)",
        related_name="included_in_the_price",
    )
    for_indoor_relaxation = models.ManyToManyField(
        to=For_indoor_relaxation,
        verbose_name="Для отдыха в помещении ",
        related_name="for_indoor_relaxation",
    )
    house_rules = models.ManyToManyField(House_rules, verbose_name="Правила дома")
    in_room = models.ManyToManyField(In_room, "in_room", verbose_name="В помещении")
    near = models.ManyToManyField(Near,verbose_name='Рядом')
    in_the_territory = models.ManyToManyField(In_the_territory,verbose_name='на территории')
    kitchen_equipment = models.ManyToManyField(
        to=Kitchen_equipment,
        verbose_name="Кухонное оборудование (что есть?)",
        related_name="kitchen_equipment",
    )
    yard_equipment = models.ManyToManyField(
        to=Yard_equipment,
        verbose_name="Оснащение двора (что есть?)",
        related_name="yard_equipment",
    )
    descriptions5 = models.TextField(verbose_name="Дополнительная информация")

    def __str__(self) -> str:
        return f"{self.address}-{self.street_number}"

    class Meta:
        verbose_name = "Дом"
        verbose_name_plural = "Дома"

    # def create(self, validated_data):
    #     city_data = validated_data.pop('city')
    #     region_data = validated_data.pop('region')
    #     images_data = validated_data.pop('images', [])

    #     city = City.objects.create(**city_data)
    #     region = Region.objects.create(**region_data)

    #     house = House.objects.create(city=city, region=region, **validated_data)

    #     for image_data in images_data:
    #         Room_images.objects.create(house=house, **image_data)

    #     house.included_in_the_price.set(validated_data['included_in_the_price'])
    #     house.for_indoor_relaxation.set(validated_data['for_indoor_relaxation'])
    #     house.kitchen_equipment.set(validated_data['kitchen_equipment'])
    #     house.yard_equipment.set(validated_data['yard_equipment'])

    #     return house
from datetime import datetime

class BookRegister(models.Model):
    data_start = models.DateField("Дата заезда")
    data_end = models.DateField("Дата выезда")
    home:House = models.ForeignKey(
        House,
        models.CASCADE,
        "book_register",
    )
    user = models.ForeignKey(
        User,
        models.CASCADE,
        "book_register",
    )

    def prise(self):
        return str(self.home.price)

    def result_prise(self):
        res = (self.data_end - self.data_start).days
        if self.data_end == self.data_start:
            return str(self.home.price)
        return str(res * self.home.price)

    def __str__(self):
        return f"с {self.data_start} до {self.data_end}"

    class Meta:
        verbose_name = "Сисек срок аренды"
        verbose_name_plural = "Списки сроков аренды"


class Room_Type(DateModelAbstract):
    num = models.PositiveIntegerField("количество комнат")

    def __str__(self) -> str:
        return f"{self.num} комнатная"

    class Meta:
        verbose_name = "количество комнат"
        verbose_name_plural = "количество комнат"


class Room_images(DateModelAbstract):
    image = ResizedImageField("Изображения комнаты",size=[920,600], upload_to="room/",quality=90,force_format='WEBP')
    house = models.ForeignKey("House", models.CASCADE, related_name="images")

    def __str__(self) -> str:
        return f"{self.house.address}"

    class Meta:
        verbose_name = "Изображения комнаты"
        verbose_name_plural = "Изображения комнат"
