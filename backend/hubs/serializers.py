from rest_framework import serializers
from .models import Hub

class HubSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Hub
        fields = ['id', 'name', 'description', 'owner', 'member_count', 'created_at']

    def get_member_count(self, obj):
        return obj.members.count()