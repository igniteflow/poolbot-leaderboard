// 'use strict';

$( document ).ready(function() {
    'use strict';

var PlayerRow = React.createClass({
  displayName: 'PlayerRow',

  diff: function diff() {
    if (this.player.diff > 0) {
      return '<button type="button" class="btn btn-success">+{{player.diff}}</button>';
    } else if (this.player.diff < 0) {
      return '<button type="button" class="btn btn-danger">-{{player.diff}}</button>';
    }
  },

  trClass: function trClass() {
    if (this.player.diff > 0) {
      return 'success';
    } else if (this.player.diff < 0) {
      return 'danger';
    }
  },

  render: function render() {
    var name = this.props.player.stocked ? this.props.player.name : React.createElement(
      'span',
      { style: { color: 'red' } },
      this.props.player.name
    );
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
        this.diff
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
    return React.createElement(
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
          rows
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(PlayersTable, null), document.getElementById('container'));
});
