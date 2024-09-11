import random
from django.db import transaction
from main.models import House, Accommodation_options, City, Room_images, Room_Type

def clone_house(house_id, num_clones):
    try:
        original_house = House.objects.get(id=house_id)
        
        # Пример списка городов для случайного выбора
        cities = list(City.objects.all())  # Получаем все доступные города
        
        # Получаем все варианты размещения
        accommodation_options = list(Accommodation_options.objects.all())
        
        # Получаем все типы комнат (Room_Type)
        room_types = list(Room_Type.objects.all())

        with transaction.atomic():
            cloned_houses = []
            for _ in range(num_clones):
                # Копируем объект дома
                cloned_house = House.objects.get(id=house_id)
                cloned_house.pk = None  # Убираем первичный ключ, чтобы создать новый объект

                # Рандомизация города
                cloned_house.city = random.choice(cities)
                
                # Рандомизация вариантов размещения
                cloned_house.accommodation_options = random.choice(accommodation_options)

                # Рандомизация типа комнаты
                cloned_house.room_type = random.choice(room_types)

                cloned_house.save()  # Сохраняем клонированный дом

                # Копируем все ManyToMany связи
                cloned_house.bathroom.set(original_house.bathroom.all())
                cloned_house.included_in_the_price.set(original_house.included_in_the_price.all())
                cloned_house.for_indoor_relaxation.set(original_house.for_indoor_relaxation.all())
                cloned_house.house_rules.set(original_house.house_rules.all())
                cloned_house.in_room.set(original_house.in_room.all())
                cloned_house.near.set(original_house.near.all())
                cloned_house.in_the_territory.set(original_house.in_the_territory.all())
                cloned_house.kitchen_equipment.set(original_house.kitchen_equipment.all())
                cloned_house.yard_equipment.set(original_house.yard_equipment.all())

                # Копирование связанных изображений комнат
                original_images = Room_images.objects.filter(house=original_house)
                for image in original_images:
                    image.pk = None  # Создаем новый объект изображения
                    image.house = cloned_house  # Привязываем к клонированному дому
                    image.save()

                cloned_houses.append(cloned_house)

            return cloned_houses
    except House.DoesNotExist:
        print("Дом с указанным ID не найден.")
        return None
