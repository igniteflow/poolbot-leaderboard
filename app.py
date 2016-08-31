import os

import requests

from flask import (
    Flask,
    render_template,
)

from cache import Cache


SLACK_NAMES = None
POOLBOT_PLAYERS_API_URL = os.environ['POOLBOT_URL']
POOLBOT_AUTH_TOKEN = os.environ['POOLBOT_TOKEN']
SLACK_API_TOKEN = os.environ['SLACK_API_TOKEN']
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
SLACK_NAMES = {
    u['name']: u['real_name']
    for u in response.json()['members']
    if 'real_name' in u
}


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
    players = response.json()
    return [
        (SLACK_NAMES.get(player['name'], player['name']), player['elo'])
        for player in players
        if player['active'] and player['total_match_count'] > 0
    ]


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
    )

if __name__ == "__main__":
    app.run()
