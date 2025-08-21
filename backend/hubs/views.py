from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Hub, Membership, Channel # Added Channel
from .serializers import HubSerializer, HubDetailSerializer, ChannelSerializer # Added new serializers

class HubViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows hubs to be viewed or edited.
    """
    queryset = Hub.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = HubSerializer # Default serializer

    def get_serializer_class(self):
        # Use a more detailed serializer for the retrieve action
        if self.action == 'retrieve':
            return HubDetailSerializer
        return HubSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        hub = self.get_object()
        user = request.user
        
        if hub.members.filter(pk=user.pk).exists():
            return Response({'detail': 'You are already a member of this hub.'}, status=status.HTTP_400_BAD_REQUEST)
        
        hub.members.add(user)
        return Response({'status': 'joined hub successfully'}, status=status.HTTP_200_OK)

# --- New ViewSet for Channels ---
class ChannelViewSet(viewsets.ModelViewSet):
    """
    API endpoint for channels within a hub.
    """
    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Filter channels based on the hub ID from the URL
        return Channel.objects.filter(hub_id=self.kwargs['hub_pk'])

    def perform_create(self, serializer):
        # Automatically associate the channel with the correct hub and owner
        hub = Hub.objects.get(pk=self.kwargs['hub_pk'])
        serializer.save(owner=self.request.user, hub=hub)
