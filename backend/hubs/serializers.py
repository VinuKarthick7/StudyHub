from rest_framework import serializers
from .models import Hub, Channel # Added Channel
from users.serializers import UserSerializer # Needed for member list

class HubSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Hub
        fields = ['id', 'name', 'description', 'owner', 'member_count', 'created_at']

    def get_member_count(self, obj):
        return obj.members.count()

# --- New Serializer for Hub Detail View ---
class HubDetailSerializer(HubSerializer):
    members = UserSerializer(many=True, read_only=True)

    class Meta(HubSerializer.Meta):
        # Inherit fields from HubSerializer and add the 'members' field
        fields = HubSerializer.Meta.fields + ['members']

# --- New Serializer for Channels ---
class ChannelSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    hub = serializers.ReadOnlyField(source='hub.name')

    class Meta:
        model = Channel
        fields = ['id', 'name', 'hub', 'owner', 'created_at']
