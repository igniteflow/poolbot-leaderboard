// 'use strict';

$( document ).ready(function() {
    'use strict';

var PlayerRow = React.createClass({
  displayName: 'PlayerRow',

  trClass: function trClass() {
    if (this.player.diff > 0) {
      return 'success';
    } else if (this.player.diff < 0) {
      return 'danger';
    }
  },

  render: function render() {
    var diffNode = '';
    var diff = this.props.player.diff;
    if (diff > 0) {
      diffNode = React.createElement(
        'button',
        { type: 'button', className: 'btn btn-success' },
        '+',
        diff
      );
    } else if (diff < 0) {
      diffNode = React.createElement(
        'button',
        { type: 'button', className: 'btn btn-danger' },
        diff
      );
    }

    return React.createElement(
      'tr',
      { className: '{this.trClass}' },
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

var PlayersTable = React.createClass({
  displayName: 'PlayersTable',

  getInitialState: function getInitialState() {
    return { players: [{ name: 'foo', position: 1, elo: 3, diff: 0 }] };
  },

  componentDidMount: function componentDidMount() {
    this.serverRequest = $.getJSON('/api/', function (players) {
      this.setState({
        players: players
      });
    }.bind(this));
  },

  componentWillUnmount: function componentWillUnmount() {
    this.serverRequest.abort();
  },

  render: function render() {
    var rows = [];
    this.state.players.forEach(function (player) {
      rows.push(React.createElement(PlayerRow, { player: player, key: player.name }));
    });

    var rowsA = rows.slice(0, 19);
    var rowsB = rows.slice(20, 39);
    var rowsC = rows.slice(40, 59);

    return React.createElement(
      'div',
      null,
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

ReactDOM.render(React.createElement(PlayersTable, null), document.getElementById('container'));
});
