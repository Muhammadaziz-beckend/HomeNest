from django.contrib import admin
from .models import Order



@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id','user','total_order_many_display','order_total']
    
    def total_order_many_display(self, obj):
        return obj.total_order_many
    total_order_many_display.short_description = 'Общая сумма заказа'

    def order_total(self, obj):
        return obj.order_total
    order_total.short_description = 'Общая количество заказа'
