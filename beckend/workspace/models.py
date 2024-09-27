from django.db import models
from account.models import User
from main.models import House  # Предполагается, что у вас есть модель House

class Order(models.Model):
    user = models.ForeignKey(User, models.CASCADE, related_name='orders', verbose_name='Арендодатель')

    @property
    def order_total(self):
        houses = House.objects.filter(user=self.user)
        total = 0

        for i in houses:
            for j in i.active_bookings.all():
                total += 1

        return total

    @property
    def orders(self):
        arr = []
        houses = House.objects.filter(user=self.user)
        
        for house in houses:
            for j in house.active_bookings.all():
                print(house,j)
                arr.append({
                    'id':j.id,
                    'data_start':j.data_start,
                    'data_end':j.data_end,
                    'home':j.home.id,
                    'user':j.user.id,
                } )

        return arr


    @property
    def total_order_many(self):
        houses = House.objects.filter(user=self.user)
        many = 0

        for house in houses:
            for active_booking in house.active_bookings:
                many += int(active_booking.result_prise)

        return many

    class Meta:
        verbose_name = "заказ"
        verbose_name_plural = "заказы"

    def __str__(self):
        return self.user.first_name
