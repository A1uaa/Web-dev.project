from rest_framework import serializers
from .models import MasterClass


class MasterClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterClass
        fields = '__all__'