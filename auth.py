import os

from functools import wraps

from flask import request, Response


# should be a comma separated string of ip addresses
WHITELISTED_IPS = os.environ.get('WHITELISTED_IPS')


def whitelisted_ips_only(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if WHITELISTED_IPS and request.remote_addr not in WHITELISTED_IPS.split(','):
            return Response('Access denied', 401)
        return f(*args, **kwargs)
    return decorated
