import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

class Button extends Component {
  state = {
    redirect: false,
  };

  clickHandler = (pdpData) => {
    let storedOrder = JSON.parse(localStorage.getItem("order")) || [];
    const storedProductIndex = storedOrder.findIndex(
      (p) => p.id === pdpData.id
    );
    if (storedProductIndex === -1) {
      storedOrder.push(pdpData);
    } else {
      storedOrder[storedProductIndex] = pdpData;
    }
    this.props.saveOrderData(storedOrder);
    localStorage.setItem("order", JSON.stringify(storedOrder));
    this.setState({ redirect: true });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/cart" />;
    }
    return (
      <button
        className={this.props.styleButton}
        onClick={() => this.clickHandler(this.props.product)}
      >
        {this.props.text}
      </button>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    orderData: state.orderData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveOrderData: (order) => {
      dispatch({ type: "SAVE_ORDER_DATA", data: order });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
