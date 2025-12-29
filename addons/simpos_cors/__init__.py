import logging
from odoo import http
import werkzeug.datastructures

_logger = logging.getLogger(__name__)

# Store original method
_original_app_call = http.Application.__call__

def cors_app_call(self, environ, start_response):
    def add_cors_headers(status, headers):
        headers = werkzeug.datastructures.Headers(headers)
        headers['Access-Control-Allow-Origin'] = '*'
        headers['Access-Control-Allow-Headers'] = 'origin, x-csrftoken, content-type, accept, x-openerp-session-id, authorization'
        headers['Access-Control-Allow-Credentials'] = 'true'
        headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
    
        return start_response(status, headers.to_list())

    if environ.get("REQUEST_METHOD") == "OPTIONS":
        add_cors_headers("200 Ok", [("Content-Type", "text/plain")])
        return [b'200 Ok']

    return _original_app_call(self, environ, add_cors_headers)

# Apply patch
try:
    http.Application.__call__ = cors_app_call
    _logger.info("Simpos CORS: Monkeypatching http.Application successful")
except Exception as e:
    _logger.error("Simpos CORS: Failed to monkeypatch http.Application: %s", e)
