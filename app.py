import logging
import os

from copy import copy

import requests

from flask import (
    Flask,
    render_template,
)

from cache import Cache


SLACK_NAMES_CACHE_KEY = 'slack_name'
PREVIOUS_STATE_CACHE_KEY = 'players_previous'
PLAYERS_CACHE_KEY = 'players'
POOLBOT_PLAYERS_API_URL = os.environ.get('POOLBOT_URL')
POOLBOT_AUTH_TOKEN = os.environ.get('POOLBOT_TOKEN')
SLACK_API_TOKEN = os.environ.get('SLACK_API_TOKEN')
PLAYERS_CACHE_TIMEOUT = 60
cache = Cache()


def slack_names():
    url = 'https://slack.com/api/users.list'
    response = requests.get(
        url,
        params=dict(
            token=SLACK_API_TOKEN
        )
    )
    content = response.json()
    if content['ok']:
        cache.set(SLACK_NAMES_CACHE_KEY, {
            u['id']: u['real_name']
            for u in content['members']
            if 'real_name' in u
        })
    else:
        logging.error(content['error'])

slack_names()


def get_diff(player):
    """returns num elo points gained/lost since the previous state"""
    for player_previous_state in cache.get(PREVIOUS_STATE_CACHE_KEY) or []:
        if player_previous_state['slack_id'] == player['slack_id']:
            return player['elo'] - player_previous_state['elo']
    return 0


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
        slack_names = cache.get(SLACK_NAMES_CACHE_KEY) or {}
        return [
            dict(
                name=slack_names.get(player['slack_id'], player['name']),
                elo=player['elo'],
                diff=get_diff(player),
                slack_id=player['slack_id'],
            )
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

    players = cache.get(PLAYERS_CACHE_KEY)
    if players is None:
        players = get_players()
        cache.set(PLAYERS_CACHE_KEY, players, timeout=PLAYERS_CACHE_TIMEOUT)
        cache.set(PREVIOUS_STATE_CACHE_KEY, players)

    return render_template(
        'table.html',
        table_a=players[:num_rows],
        table_b=players[num_rows:num_rows + num_rows],
        table_c=players[num_rows + num_rows:num_rows + num_rows + num_rows],
        num_rows=num_rows,
        time_left=cache.time_remaining(PLAYERS_CACHE_KEY),
    )

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
