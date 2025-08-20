from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # We're extending Django's default user model.
    # We can add extra fields here in the future.
    # For now, we'll just use the built-in fields like
    # username, email, password, etc.
    pass