import React from 'react';  

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
    
    var content = <div className="form-group">
                    <textarea className="form-control" name="riddle" placeholder="Enter Riddle" ref="riddleInput" onChange={this.riddleInput}/>
                  </div>;  

    var solution = <div className="form-group">
                     <input type="text" className="form-control" placeholder="Enter Solution" ref="solutionInput" onChange={this.solutionInput}/>  
                   </div>

    var hint = <div className="form-group">
                <textarea className="form-control" name="Hint" placeholder="Enter Hint" ref="hintInput" onChange={this.hintInput} />
               </div>;  

    var submitButton = <div className="form-group">
                         <input type="submit" className="form-control" value="Create Riddle" onClick={this.onSubmit} disabled={!this.isReady()} />
                       </div>;

    if(this.props.nextLoc != null)
      var nextLoc = <div>Enter a riddle whose answer is {this.props.nextLoc}</div>;
    else
      var nextLoc = <div>Enter a one-word answer riddle of your choice</div>;
   
    return <div className="form"> {nextLoc} {content} {solution} {hint} {submitButton} </div>; 
  
  }

});

export default CreateRiddle;
