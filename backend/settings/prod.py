from .base import *
import dj_database_url

ALLOWED_HOSTS = ['www.kpulka.com', 'studentoffers-api-4d3d4bd53a9c.herokuapp.com']

DATABASES['default'] = dj_database_url.config(
    conn_max_age=600,
    conn_health_checks=True,
)
