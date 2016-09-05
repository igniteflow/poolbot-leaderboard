var PlayerRow = React.createClass({
      render: function() {
        var diffNode = '';
        if (this.props.player.diff > 0) {
          diffNode = <button type="button" className="btn btn-success">+{this.props.player.diff}</button>;
        } else if (this.props.player.diff < 0) {
          diffNode = <button type="button" className="btn btn-danger">{this.props.player.diff}</button>;
        }

        var trClass = '';
        if (this.props.player.diff > 0) {
          trClass = 'success';
        } else if (this.props.player.diff < 0) {
          trClass = 'danger';
        }

        return (
          <tr className={trClass}>
              <th scope="row">{this.props.player.position}</th>
              <td>{this.props.player.name}</td>
              <td>{this.props.player.elo}</td>
              <td>{diffNode}</td>
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

        var rowsA = rows.slice(0, 19);
        var rowsB = rows.slice(20, 39);
        var rowsC = rows.slice(40, 59);

        return (
          <div>
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
                    {rowsA}
                </tbody>
              </table>
            </div>

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
                    {rowsB}
                </tbody>
              </table>
            </div>

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
                    {rowsC}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    });

    ReactDOM.render(
      <PlayersTable />,
      document.getElementById('container')
    );
