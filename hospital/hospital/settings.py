import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = 'django-insecure-7rwyqhc^u&micuoif5cf+xxebp@*sqz7o8gju$z+xg!!mvw31p'

DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = ['*']


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'cloudinary_storage',          # Must be before staticfiles
    'django.contrib.staticfiles',
    'cloudinary',

    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'djoser',


    'medflow',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    
    'corsheaders.middleware.CorsMiddleware', 
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'hospital.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media', # Added for media access in templates
            ],
        },
    },
]

WSGI_APPLICATION = 'hospital.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'railway',
        'USER': 'postgres',
        'PASSWORD': 'RokFDTPGVWXOFAfWadzKhGazCXVOzyZF',
        'HOST': 'yamabiko.proxy.rlwy.net',
        'PORT': '19892',
    }
}


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated', 
    ],
}

DJOSER = {
    'USER_CREATE_PASSWORD_RETYPE': True,
    'SEND_ACTIVATION_EMAIL': True,
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'SERIALIZERS': {
        'user': 'medflow.serializers.CustomUserSerializer',
        'current_user': 'medflow.serializers.CustomUserSerializer',
    },
    'EMAIL': {
        'activation': 'medflow.emails.CustomActivationEmail',
    },
}


LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# --- CLOUDINARY STORAGE ---
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'diqzmwyy6',
    'API_KEY': '412544457667796',
    'API_SECRET': 'o80VQRy-stk75RHAdNTgF3Gv0ec',
}

# Django 4.2+ uses STORAGES dict; also keep DEFAULT_FILE_STORAGE for older compat.
STORAGES = {
    'default': {
        'BACKEND': 'cloudinary_storage.storage.MediaCloudinaryStorage',
    },
    'staticfiles': {
        'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
    },
}

# --- EMAIL (Gmail SMTP) ---
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'shemkyle20@gmail.com'
EMAIL_HOST_PASSWORD = 'rhfunevdygpcgzwx'
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'shemkyle20@gmail.com'

CORS_ALLOW_ALL_ORIGINS = True 

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'