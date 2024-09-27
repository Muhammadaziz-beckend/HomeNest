from workspace.models import Order
from rest_framework import serializers


class OrdersSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_total','orders','total_order_many']

    
