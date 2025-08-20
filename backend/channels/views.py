from rest_framework import viewsets, permissions
from .models import Channel
from .serializers import ChannelSerializer
from hubs.models import Hub

class ChannelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # This view should only return channels for the hub specified in the URL
        return Channel.objects.filter(hub_id=self.kwargs['hub_pk'])

    def perform_create(self, serializer):
        # When creating a channel, automatically associate it with the hub from the URL
        # and the user making the request.
        hub = Hub.objects.get(pk=self.kwargs['hub_pk'])
        serializer.save(owner=self.request.user, hub=hub)