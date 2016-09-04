var PlayerRow = React.createClass({
      diff: function() {
        if (this.player.diff > 0) {
          return '<button type="button" class="btn btn-success">+{{player.diff}}</button>';
        } else if (this.player.diff < 0) {
          return '<button type="button" class="btn btn-danger">-{{player.diff}}</button>';
        }
      },

      trClass: function() {
        if (this.player.diff > 0) {
          return 'success';
        } else if (this.player.diff < 0) {
          return 'danger';
        }
      },

      render: function() {
        var name = this.props.player.stocked ?
          this.props.player.name :
          <span style={{color: 'red'}}>
            {this.props.player.name}
          </span>;
        return (
          <tr className="{this.trClass}">
              <th scope="row">{this.props.player.position}</th>
              <td>{this.props.player.name}</td>
              <td>{this.props.player.elo}</td>
              <td>{this.diff}</td>
          </tr>
        );
      }
    });

    var PlayersTable = React.createClass({
      getInitialState: function() {
        return {players: [{name: 'foo', position: 1, elo: 3, diff: 0}]};
      },

      componentDidMount: function() {
        this.serverRequest = $.getJSON('/api/', function (players) {
          this.setState({
            players: players
          });
        }.bind(this));
      },

      componentWillUnmount: function() {
        this.serverRequest.abort();
      },

      render: function() {
        var rows = [];
        this.state.players.forEach(function(player) {
          rows.push(<PlayerRow player={player} key={player.name} />);
        });
        return (
          <div className="col-xs-4">
            <table className="table table-striped">
              <thead>
                  <tr>
                      <th>#</th>
                      <th>Player</th>
                      <th>Elo</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  {rows}
              </tbody>
            </table>
          </div>
        );
      }
    });

    ReactDOM.render(
      <PlayersTable />,
      document.getElementById('container')
    );
