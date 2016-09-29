build:
	git pull --rebase
	pip install -r requirements.txt
	npm install
	gulp

start_browser:
	# ensure screen is inverted
	xrandr --output HDMI1 --rotate inverted --display :0.0

	# disable screensaver
	export DISPLAY=:0.0
	xset s off
	xset s noblank
	xset -dpms

	# kill active browser sessions
	killall -15 chromium-browser

	# start the server and fire up the browser
	start_server
	chromium-browser --incognito --kiosk --start-fullscreen --display=:0 http://127.0.0.1:5000 >&/dev/null &

start_server:
	killall -15 flask
	export FLASK_APP='app.py'
	nohup flask run --host=0.0.0.0 >&/dev/null &
