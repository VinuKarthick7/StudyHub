from django.db import models
from django.conf import settings
from hubs.models import Hub

class Channel(models.Model):
    name = models.CharField(max_length=100)
    hub = models.ForeignKey(Hub, on_delete=models.CASCADE, related_name='channels')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'#{self.name} in {self.hub.name}'