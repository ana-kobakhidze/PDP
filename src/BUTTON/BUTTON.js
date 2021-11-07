import React, { Component } from 'react';
import { Redirect }  from 'react-router-dom';


class Button extends Component{
    state = {
        redirect: false,
        prevData: []
    }
clickHandler = (pdpData) => {
    const { prevData } = this.state;
     if(pdpData !== prevData){
        prevData.push(pdpData)
     
     }
     localStorage.setItem('order', JSON.stringify(prevData))
    this.setState({redirect: true})
 }
 componentDidMount(){
    const data = localStorage.getItem('order')
    if(data){
      const parsedData =JSON.parse(data);
      this.setState({prevData: parsedData})
    }
 }
 
 

    render(){
        if(this.state.redirect){
           return <Redirect to="/cart" />
        }
        return(
            
            <button 
            className={this.props.styleButton}
            onClick={() => this.clickHandler(this.props.product)
            
            }
            >
            {this.props.text}
            </button>
            
        )
    }
}

export default Button;
