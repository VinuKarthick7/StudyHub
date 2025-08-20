from rest_framework import serializers
from .models import Channel

class ChannelSerializer(serializers.ModelSerializer):
    hub = serializers.ReadOnlyField(source='hub.name')
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Channel
        fields = ['id', 'name', 'hub', 'owner', 'created_at']