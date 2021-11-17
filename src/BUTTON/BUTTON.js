import React, { Component } from 'react';
import { Redirect }  from 'react-router-dom';
import { connect } from 'react-redux';


class Button extends Component{
    state = {
        redirect: false
    }

//  componentDidMount(){
//     const data = localStorage.getItem('order')
//     if(data){
//       const parsedData = data ? JSON.parse(data) : [];
//       this.setState({prevData: parsedData})
//     }
//  }
 clickHandler = (pdpData) => {
    let storageData = JSON.parse(localStorage.getItem('order')) || [];
     if(pdpData !== this.props.orderData && pdpData !== storageData ){
        storageData.push(pdpData)
        this.props.saveOrderData(storageData);
        localStorage.setItem('order', JSON.stringify(storageData))
     }
     console.log(storageData)
     console.log(pdpData)
     console.log(this.props.orderData)
     this.setState({redirect: true})
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
const mapStateToProps = (state) => {
    return{
        orderData: state.orderData
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        saveOrderData: (order) => {dispatch({type: 'SAVE_ORDER_DATA', data: order})}
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Button);
