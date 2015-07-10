var Questions = React.createClass({
  getInitialState: function() {
    return {value: 'Hello!'};
  },
  handleChange: function(event) {
    this.setState({value: event.target.value.substr(0, 20)});
  },
  render: function() {
    var value = this.state.value;
    return (<input type="text" value={value} onChange={this.handleChange} />);
  }
});

React.render(<Questions />, document.getElementById("question-form"));
