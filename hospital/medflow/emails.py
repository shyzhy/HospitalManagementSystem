from djoser import email
from django.conf import settings


class CustomActivationEmail(email.ActivationEmail):
    template_name = "emails/activation.html"

    def get_context_data(self):
        context = super().get_context_data()
        context["frontend_url"] = getattr(
            settings,
            "FRONTEND_URL",
            "http://localhost:3000"
        )
        return context