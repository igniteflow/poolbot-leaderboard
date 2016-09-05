var PlayersTable = React.createClass({
  getInitialState: function () {
    return { players: [], percent: 0 };
  },

  componentDidMount: function () {
    this.loadData();
  },

  loadData: function () {
    $.getJSON('/api/', function (data) {
      this.setState({
        players: data.players
      });

      var self = this;
      var nextRefresh = moment().add(data.secondsLeft, 'seconds');
      var cacheLifetime = data.cacheLifetime;
      var updateProgressBar = setInterval(function () {
        var secondsLeft = nextRefresh.diff(moment(), 'seconds');
        if (secondsLeft == 0) {
          clearInterval(updateProgressBar);
          self.loadData();
        };
        self.setState({ percent: Math.floor(secondsLeft / cacheLifetime * 100) });
      }, 1000);
    }.bind(this));
  },

  render: function () {
    var rows = [];
    this.state.players.forEach(function (player) {
      rows.push(React.createElement(PlayerRow, { player: player, key: player.position }));
    });
    var progressBar = React.createElement(ProgressBar, { percent: this.state.percent });

    var rowsA = rows.slice(0, 19);
    var rowsB = rows.slice(20, 39);
    var rowsC = rows.slice(40, 59);

    return React.createElement(
      'div',
      null,
      progressBar,
      React.createElement(
        'div',
        { className: 'col-xs-4' },
        React.createElement(
          'table',
          { className: 'table table-striped' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                null,
                '#'
              ),
              React.createElement(
                'th',
                null,
                'Player'
              ),
              React.createElement(
                'th',
                null,
                'Elo'
              ),
              React.createElement('th', null)
            )
          ),
          React.createElement(
            'tbody',
            null,
            rowsA
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'col-xs-4' },
        React.createElement(
          'table',
          { className: 'table table-striped' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                null,
                '#'
              ),
              React.createElement(
                'th',
                null,
                'Player'
              ),
              React.createElement(
                'th',
                null,
                'Elo'
              ),
              React.createElement('th', null)
            )
          ),
          React.createElement(
            'tbody',
            null,
            rowsB
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'col-xs-4' },
        React.createElement(
          'table',
          { className: 'table table-striped' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                null,
                '#'
              ),
              React.createElement(
                'th',
                null,
                'Player'
              ),
              React.createElement(
                'th',
                null,
                'Elo'
              ),
              React.createElement('th', null)
            )
          ),
          React.createElement(
            'tbody',
            null,
            rowsC
          )
        )
      )
    );
  }
});

var PlayerRow = React.createClass({
  render: function () {
    var diffNode = '';
    if (this.props.player.diff > 0) {
      diffNode = React.createElement(
        'button',
        { type: 'button', className: 'btn btn-success' },
        '+',
        this.props.player.diff
      );
    } else if (this.props.player.diff < 0) {
      diffNode = React.createElement(
        'button',
        { type: 'button', className: 'btn btn-danger' },
        this.props.player.diff
      );
    }

    var trClass = '';
    if (this.props.player.diff > 0) {
      trClass = 'success';
    } else if (this.props.player.diff < 0) {
      trClass = 'danger';
    }

    return React.createElement(
      'tr',
      { className: trClass },
      React.createElement(
        'th',
        { scope: 'row' },
        this.props.player.position
      ),
      React.createElement(
        'td',
        null,
        this.props.player.name
      ),
      React.createElement(
        'td',
        null,
        this.props.player.elo
      ),
      React.createElement(
        'td',
        null,
        diffNode
      )
    );
  }
});

var ProgressBar = React.createClass({

  render: function () {
    var style = { width: this.props.percent.toString() + '%' };
    return React.createElement(
      'div',
      { className: 'progress' },
      React.createElement('div', {
        className: 'progress-bar progress-bar-striped active',
        role: 'progressbar',
        'aria-valuenow': '100',
        'aria-valuemin': '0',
        'aria-valuemax': '100',
        style: style })
    );
  }
});