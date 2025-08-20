# hubs/urls.py
from django.urls import path, include
from rest_framework_nested import routers
from .views import HubViewSet
from channels.views import ChannelViewSet # Import the ChannelViewSet

router = routers.DefaultRouter()
router.register(r'hubs', HubViewSet, basename='hub')

# Create a nested router for channels within hubs
hubs_router = routers.NestedDefaultRouter(router, r'hubs', lookup='hub')
hubs_router.register(r'channels', ChannelViewSet, basename='hub-channels')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(hubs_router.urls)),
]