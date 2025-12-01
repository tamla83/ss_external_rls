import logging
import os

logger = logging.getLogger()

SQLALCHEMY_DATABASE_URI = os.environ.get("SUPERSET_DATABASE_URI")

SUPERSET_LOAD_EXAMPLES = False

# Feature flags
FEATURE_FLAGS = {
    "ENABLE_TEMPLATE_PROCESSING": True,
    "DASHBOARD_RBAC": True,
    "SCHEMA_PERMISSIONS": True,
    "ALERT_REPORTS": True,
    "ALERT_REPORTS_V2": True,
    "EMBEDDED_SUPERSET": True,
}

HTML_SANITIZATION_SCHEMA_EXTENSIONS = {
    "attributes": {"*": ["class", "style", "className"]},
    "tagNames": ["style"],
}

DEBUG = True

GUEST_ROLE_NAME = "Gamma"

ALLOWED_EMBEDDED_DOMAINS = os.environ.get("ALLOWED_EMBEDDED_DOMAINS", "").split(",")  # noqa
ALLOWED_EMBEDDED_DOMAINS = [
    domain.strip() for domain in ALLOWED_EMBEDDED_DOMAINS if domain.strip()
]
if not ALLOWED_EMBEDDED_DOMAINS:
    ALLOWED_EMBEDDED_DOMAINS = ["http://localhost:8000"]

GUEST_TOKEN_JWT_SECRET = os.environ.get("SUPERSET_GUEST_TOKEN_JWT_SECRET")

ENABLE_PROXY_FIX = True
TALISMAN_ENABLED = False

# --- CORS Configuration ---
ENABLE_CORS = True
CORS_OPTIONS = {
    "supports_credentials": True,
    "allow_headers": ["*"],
    "resources": ["*"],
    "origins": ALLOWED_EMBEDDED_DOMAINS,
}

# --- Session Cookie Settings ---
SESSION_COOKIE_SAMESITE = None
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = False

# --- CSRF Settings ---
# WARNING: INSECURE - DO NOT USE IN PRODUCTION
WTF_CSRF_ENABLED = False
WTF_CSRF_EXEMPT_LIST = [  # Keep list in case you re-enable CSRF later
    'superset.views.core.guest_token',
    'app.views.api.guest_token',
    'superset.security.api.guest_token',
    'superset.security.api.SecurityRestApi.guest_token',
    '/api/v1/security/guest_token/'
]
