import logging
import os

import requests

from flask import (
    Flask,
    render_template,
)

from cache import Cache


SLACK_NAMES = {}
POOLBOT_PLAYERS_API_URL = os.environ.get('POOLBOT_URL')
POOLBOT_AUTH_TOKEN = os.environ.get('POOLBOT_TOKEN')
SLACK_API_TOKEN = os.environ.get('SLACK_API_TOKEN')
PLAYERS_CACHE_TIMEOUT = 60 * 5

cache = Cache()


# call once to populate map
url = 'https://slack.com/api/users.list'
response = requests.get(
    url,
    params=dict(
        token=SLACK_API_TOKEN
    )
)
content = response.json()
if content['ok']:
    SLACK_NAMES = {
        u['name']: u['real_name']
        for u in content['members']
        if 'real_name' in u
    }
else:
    logging.error(content['error'])


def get_players():
    response = requests.get(
        POOLBOT_PLAYERS_API_URL,
        params=dict(
            active=True,
            ordering='-elo',
        ),
        headers=dict(
            Authorization='Token {}'.format(POOLBOT_AUTH_TOKEN),
        )
    )
    if response.ok:
        players = response.json()
        return [
            (SLACK_NAMES.get(player['name'], player['name']), player['elo'])
            for player in players
            if player['active'] and player['total_match_count'] > 0
        ]
    else:
        logging.error(response.content)
        return []


app = Flask(__name__)


@app.route("/")
def index():
    num_rows = 20

    cache_key = 'players'
    players = cache.get(cache_key)
    if players is None:
        players = get_players()
        cache.set(cache_key, players, timeout=PLAYERS_CACHE_TIMEOUT)

    return render_template(
        'table.html',
        table_a=players[:num_rows],
        table_b=players[num_rows:num_rows + num_rows],
        table_c=players[num_rows + num_rows:num_rows + num_rows + num_rows],
        num_rows=num_rows,
        time_left=cache.time_remaining(cache_key),
    )

if __name__ == "__main__":
    app.run()
