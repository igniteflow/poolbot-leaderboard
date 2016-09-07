#!/bin/bash

# disable screensaver
export DISPLAY=:0.0
xset s off
xset s noblank
xset -dpms

# kill active processes
ps axf | grep "flask" | grep -v grep | awk '{print "kill -9 " $1}' | sh
killall -15 chromium-browser

# start the server and fire up the browser
export FLASK_APP='app.py'
# nohup gunicorn -w 1 -b 127.0.0.1:5000 app:app >&/dev/null &
nohup flask run --host=0.0.0.0 >&/dev/null &
chromium-browser --start-fullscreen --display=:0 http://127.0.0.1:5000 >&/dev/null &
