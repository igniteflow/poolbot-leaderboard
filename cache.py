import time


class Cache(object):
    def __init__(self):
        self._cache = {}

    def get(self, key):
        item = self._cache.get(key)
        if not item:
            return

        now = time.time()
        expired = now - item['timer_start'] > item['timeout']
        if not expired:
            return item['value']

    def set(self, key, value, timeout):
        now = time.time()
        self._cache[key] = dict(value=value, timer_start=now, timeout=timeout)
