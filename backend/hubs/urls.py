# hubs/urls.py
from django.urls import path, include
from rest_framework_nested import routers
# Import both ViewSets from the local views.py file
from .views import HubViewSet, ChannelViewSet 

router = routers.DefaultRouter()
router.register(r'hubs', HubViewSet, basename='hub')

# This part remains the same
hubs_router = routers.NestedDefaultRouter(router, r'hubs', lookup='hub')
hubs_router.register(r'channels', ChannelViewSet, basename='hub-channels')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(hubs_router.urls)),
]