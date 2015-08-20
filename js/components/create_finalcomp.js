import React from 'react';

var CreateFinalComp = React.createClass({

  onSubmit: function () {
    //TODO
    var jsonData = {adventure: {title:       this.props.title,
                                description: this.props.description,
                                challenges:  this.props.challenges}};

    console.log("JSON DATA: ");
    console.log(jsonData);
    var url ="http://localhost:3000/adventures"; 
    
    $.ajax({
      type: "POST",
      url: url,
      data: jsonData,
      success: function (data) {
        console.log(data);
      }.bind(this)
    });
  },

  isReady: function() {
    return true;
  },

  render: function () {
    
    var challenges = this.props.challenges.map(function (a, index){
                     return (<div><h5>Location {index+1}: {a.address}</h5>
                                  <h5>Riddle: {a.riddle.content}</h5>
                                  <h5>Riddle answer: {a.riddle.solution}</h5>
                                  <h5>Riddle hint: {a.riddle.hint}</h5><hr/></div>); 
    });

    var summary = <div>
                    <h3>Name of Adventure: {this.props.title}</h3>
                    <hr/>
                    <h3>Description of Adventure: {this.props.description}</h3>
                    <hr/>
                    <div>{challenges}</div>
                  </div>;

    var submitButton = <div className="form-group">
                        <input className="form-control" type="submit" value="Create Adventure" onClick={this.onSubmit} />
                       </div>;

    return <div>
             {summary} {submitButton}
           </div>;

  }

});

export default CreateFinalComp;
