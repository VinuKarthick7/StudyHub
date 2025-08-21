import os
import django
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Study_Hub.settings')
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from chat.middleware import TokenAuthMiddleware  # Import our new middleware
import chat.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": TokenAuthMiddleware(  # Use our custom middleware
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})