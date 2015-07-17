var CreateRiddle = React.createClass({
  getInitialState: function () {
    return {riddle: "", solution: "", hint: ""};
  },

  riddleInput: function () {
    this.setState({riddle: this.refs.riddleInput.getDOMNode().value}); 
  },

  solutionInput: function () {
    this.setState({solution: this.refs.solutionInput.getDOMNode().value}); 
  },

  hintInput: function () {
    this.setState({hint: this.refs.hintInput.getDOMNode().value}); 
    //this.pass();
  },

  pass: function () {
    this.props.pass({content:  this.state.riddle,
                     solution: this.state.solution,
                     hint:     this.state.hint}); 
  },

  //TODO REVIEW !!!
  onSubmit: function () {
    this.pass(); 
  },

  isReady: function () {
     return Object.keys(this.state.riddle).length > 0
  },

  render: function () {
    
    var content = <div><textarea name="riddle" placeholder="Enter Riddle" ref="riddleInput" onChange={this.riddleInput}/></div>;  
    var solution = <div><input type="text" placeholder="Enter Solution" ref="solutionInput" onChange={this.solutionInput}/></div>;  
    var hint = <div><textarea name="Hint" placeholder="Enter Hint" ref="hintInput" onChange={this.hintInput} /></div>;  

    var submitButton = <div><input type="submit" value="Next Question" onClick={this.onSubmit} disabled={!this.isReady()} /></div>;

    if(this.props.nextLoc != null)
      var nextLoc = <div>Enter a riddle leading to {this.props.nextLoc}</div>;
    else
      var nextLoc = <div>Enter a Riddle of your Choice</div>;
   
    return <div> {nextLoc} {content} {solution} {hint} {submitButton} </div>; 
  
  }

});
