import time


class Cache(object):
    def __init__(self):
        self._cache = {}

    def get(self, key):
        if self._has_expired(key):
            del self._cache[key]

        if key not in self._cache:
            return

        return self._cache[key]['value']

    def set(self, key, value, timeout=None):
        now = time.time()
        self._cache[key] = dict(value=value, start=now, timeout=timeout)

    def time_remaining(self, key):
        item = self._cache.get(key)
        if item is None or item['timeout'] is None:
            return
        elapsed = time.time() - item['start']
        time_remaining = item['timeout'] - elapsed
        if time_remaining < 0:
            del self._cache[key]
            return
        return time_remaining

    def _has_expired(self, key):
        return self.time_remaining(key) == 0
