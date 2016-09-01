import time


class Cache(object):
    def __init__(self):
        self._cache = {}

    def get(self, key):
        item = self._cache.get(key)
        if item and not self.has_expired(key):
            return item['value']

    def set(self, key, value, timeout):
        now = time.time()
        self._cache[key] = dict(value=value, start=now, timeout=timeout)

    def time_remaining(self, key):
        item = self._cache.get(key)
        elapsed = time.time() - item['start']
        return item['timeout'] - elapsed

    def has_expired(self, key):
        return self.time_remaining(key) <= 0
