from django.db import models
from django.conf import settings

class Hub(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='owned_hubs', on_delete=models.CASCADE)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Membership', related_name='member_of_hubs')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Membership(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    hub = models.ForeignKey(Hub, on_delete=models.CASCADE)
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'hub')

# --- ADD THE CHANNEL MODEL HERE ---
class Channel(models.Model):
    name = models.CharField(max_length=100)
    hub = models.ForeignKey(Hub, on_delete=models.CASCADE, related_name='channels')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'#{self.name} in {self.hub.name}'