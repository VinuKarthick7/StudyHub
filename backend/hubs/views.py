from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Hub, Membership, Channel
from .serializers import HubSerializer, HubDetailSerializer, ChannelSerializer
from .permissions import IsOwnerOrReadOnly

class HubViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows hubs to be viewed or edited.
    """
    queryset = Hub.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
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

    # --- New "Leave Hub" Action ---
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def leave(self, request, pk=None):
        hub = self.get_object()
        user = request.user

        # The owner cannot leave their own hub
        if hub.owner == user:
            return Response({'detail': 'The owner cannot leave the hub.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user is actually a member
        if not hub.members.filter(pk=user.pk).exists():
            return Response({'detail': 'You are not a member of this hub.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Remove the user from the hub's member list
        hub.members.remove(user)
        return Response({'status': 'left hub successfully'}, status=status.HTTP_200_OK)


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
