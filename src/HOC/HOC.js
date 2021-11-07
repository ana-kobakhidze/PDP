import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

class urlPathHandler extends Component{
    render(){
        let history = this.props.history;
        let string = history.location.pathname.split("/");
        string = string[string.length - 1];
        return(
          {string}
        )
    }
}

export default withRouter(urlPathHandler);