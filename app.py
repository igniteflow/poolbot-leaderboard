import logging
import os

import requests

from flask import (
    Flask,
    render_template,
    send_from_directory,
    json,
)

from cache import Cache

SLACK_NAMES_CACHE_KEY = 'slack_name'
PREVIOUS_STATE_CACHE_KEY = 'players_previous'
PLAYERS_CACHE_KEY = 'players'
POOLBOT_PLAYERS_API_URL = os.environ.get('POOLBOT_URL')
POOLBOT_AUTH_TOKEN = os.environ.get('POOLBOT_TOKEN')
SLACK_API_TOKEN = os.environ.get('SLACK_API_TOKEN')
PLAYERS_CACHE_TIMEOUT = 30

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
    """returns num season_elo points gained/lost since the previous state"""
    for player_previous_state in cache.get(PREVIOUS_STATE_CACHE_KEY) or []:
        if player_previous_state['slack_id'] == player['slack_id']:
            return player['season_elo'] - player_previous_state['season_elo']
    return 0


def get_players():
    response = requests.get(
        POOLBOT_PLAYERS_API_URL,
        params=dict(
            active=True,
            ordering='-season_elo',
        ),
        headers=dict(
            Authorization='Token {}'.format(POOLBOT_AUTH_TOKEN),
        )
    )

    if response.ok:
        players = response.json()
        slack_names = cache.get(SLACK_NAMES_CACHE_KEY) or {}

        _players = [
            dict(
                name=slack_names.get(player['slack_id'], player['name']),
                season_elo=player['season_elo'],
                diff=get_diff(player),
                slack_id=player['slack_id'],
            )
            for player in players
            if player['active'] and player['season_match_count'] > 0
        ]

        # add positions
        for position, p in enumerate(_players, start=1):
            p['position'] = position

        return _players
    else:
        logging.error(response.content)
        return []


app = Flask(__name__, static_url_path='/static')


@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)


@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)


@app.route('/api/')
def players():
    current_state = cache.get(PLAYERS_CACHE_KEY)
    previous_state = cache.get(PREVIOUS_STATE_CACHE_KEY)

    if not current_state and not previous_state:
        # intialise
        players = get_players()
        cache.set(PLAYERS_CACHE_KEY, players, timeout=PLAYERS_CACHE_TIMEOUT)
        cache.set(PREVIOUS_STATE_CACHE_KEY, players)
    elif current_state is None:
        # cache has expired, refresh the players list
        players = get_players()

        no_change = set([p['diff'] for p in players]) == set([0])
        if no_change:
            # elo hasn't changed meaning no one has played
            cache.set(PLAYERS_CACHE_KEY, previous_state, timeout=PLAYERS_CACHE_TIMEOUT)
        else:
            # someone's played, update the table
            cache.set(PLAYERS_CACHE_KEY, players, timeout=PLAYERS_CACHE_TIMEOUT)
            cache.set(PREVIOUS_STATE_CACHE_KEY, players)

    return json.dumps(
        dict(
            players=cache.get(PLAYERS_CACHE_KEY),
            secondsLeft=cache.time_remaining(PLAYERS_CACHE_KEY),
            cacheLifetime=PLAYERS_CACHE_TIMEOUT
        )
    )


@app.route("/")
def index():
    return render_template('index.html')


if __name__ == "__main__":
    slack_names()
    app.run(debug=True, threaded=True)
