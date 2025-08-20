from rest_framework import viewsets, permissions, status # Add status
from rest_framework.decorators import action # Add action
from rest_framework.response import Response # Add Response
from .models import Hub, Membership # Add Membership
from .serializers import HubSerializer

class HubViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows hubs to be viewed or edited.
    """
    queryset = Hub.objects.all()
    serializer_class = HubSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    # --- New code below ---

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        hub = self.get_object()
        user = request.user
        
        # Check if the user is already a member
        if hub.members.filter(pk=user.pk).exists():
            return Response({'detail': 'You are already a member of this hub.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Add the user to the hub
        hub.members.add(user)
        return Response({'status': 'joined hub successfully'}, status=status.HTTP_200_OK)