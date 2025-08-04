from .defaults import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

DEPLOY_ENVIRONMENT = Environment.DEVELOPMENT
# Base URL to use when referring to full URLs within the Wagtail admin backend -
# e.g. in notification emails. Don't include '/admin' or a trailing slash
# FIXME: needs to be overridden in staging and prod after updating DEPLOY_ENVIRONMENT which is less than ideal

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


if not TESTING:
    INSTALLED_APPS += [
        "debug_toolbar",
        "fixture_magic",
    ]
    MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "server"]

# IP Address inside docker container
INTERNAL_IPS = ["172.18.0.1"]

# Fix for debug toolbar not showing up with dynamic docker IP
# (https://stackoverflow.com/a/50492036)
DEBUG_TOOLBAR_CONFIG = {"SHOW_TOOLBAR_CALLBACK": lambda _request: DEBUG}

DEBUG_TOOLBAR_PANELS = [
    "debug_toolbar.panels.versions.VersionsPanel",
    "debug_toolbar.panels.timer.TimerPanel",
    "debug_toolbar.panels.settings.SettingsPanel",
    "debug_toolbar.panels.headers.HeadersPanel",
    "debug_toolbar.panels.request.RequestPanel",
    "debug_toolbar.panels.sql.SQLPanel",
    "debug_toolbar.panels.staticfiles.StaticFilesPanel",
    "debug_toolbar.panels.templates.TemplatesPanel",
    "debug_toolbar.panels.cache.CachePanel",
    "debug_toolbar.panels.signals.SignalsPanel",
    "debug_toolbar.panels.logging.LoggingPanel",
    "debug_toolbar.panels.redirects.RedirectsPanel",
    "debug_toolbar.panels.profiling.ProfilingPanel",
    # 'ddt_request_history.panels.request_history.RequestHistoryPanel',
]

WAFFLE_SWITCH_DEFAULT = True
