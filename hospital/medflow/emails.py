from djoser import email
from django.template.loader import render_to_string
from django.utils.html import strip_tags
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

    def send(self, to, *args, **kwargs):
        context = self.get_context_data()

        html_content = render_to_string(self.template_name, context)
        plain_text = strip_tags(html_content)

        self.subject = "Activate your MedFlow Account"
        self.body = plain_text
        self.from_email = kwargs.pop(
            "from_email",
            getattr(settings, "DEFAULT_FROM_EMAIL", None)
        )
        self.to = to

        self.attach_alternative(html_content, "text/html")
        super(email.ActivationEmail, self).send(to, *args, **kwargs)