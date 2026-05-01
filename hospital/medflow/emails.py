from djoser import email
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from djoser import utils
from django.contrib.auth.tokens import default_token_generator
from djoser.conf import settings


class CustomActivationEmail(email.ActivationEmail):
    template_name = "emails/activation.html"

    def send(self, to, *args, **kwargs):
        context = self.get_context_data()
        # Render HTML template
        html_content = render_to_string(self.template_name, context)
        plain_text = strip_tags(html_content)

        self.subject = "Activate your MedFlow Account"
        self.body = plain_text
        self.from_email = kwargs.pop(
            'from_email',
            getattr(settings, 'DEFAULT_FROM_EMAIL', None)
            or __import__('django.conf', fromlist=['settings']).settings.DEFAULT_FROM_EMAIL
        )
        self.to = to
        self.attach_alternative(html_content, 'text/html')
        super(email.ActivationEmail, self).send(*args, **kwargs)
