var PlayersTable = React.createClass({
  getInitialState: function() {
      return {players: []}
  },

  componentDidMount: function() {
    this.loadData();
    setInterval(this.loadData.bind(this), 60 * 1000);
  },

  loadData: function() {
    $.getJSON('/players/', function (players) {
      this.setState({
        players: players
      });
    }.bind(this));
  },

  render: function() {
    var rows = [];
    this.state.players.forEach(function(player) {
      rows.push(<PlayerRow player={player} key={player.position} />);
    });
    var progressBar = <ProgressBar />;

    var rowsA = rows.slice(0, 19);
    var rowsB = rows.slice(20, 39);
    var rowsC = rows.slice(40, 59);

    return (
      <div>
        {progressBar}
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

var ProgressBar = React.createClass({

  getInitialState: function() {
    return {percent: 100}
  },

  setPercent: function(timeLeft){
    var next_refresh = moment().add(timeLeft, 'seconds');
    var secondsLeft = next_refresh.diff(moment(), 'seconds');
    this.setState({percent: Math.floor((secondsLeft / 60) * 100)});
  },

  componentDidMount: function() {
    this.setPercent(self.state.percent);
    setInterval(this.setPercent.bind(this), 3 * 1000);
  },

  getSecondsUntilNextUpdate: function() {
    $.getJSON('/timeleft/', function (data) {
      console.log(data);
      this.setPercent(data['timeleft']);
    }.bind(this));
  },

  render: function() {
    var style = {width: this.state.percent.toString() + '%'}
    return (
      <div className="progress">
        <div
            className="progress-bar progress-bar-striped active"
            role="progressbar"
            aria-valuenow="100"
            aria-valuemin="0"
            aria-valuemax="100"
            style={style}>
        </div>
      </div>
    )
  },
})
