import React, { Component } from "react";
import { gql } from "@apollo/client";
import { connect } from "react-redux";

import styles from "./CURRENCY.module.css";
import getSymbolFromCurrency from "currency-symbol-map";

const DATA_QUERY = gql`
  query {
    currencies
  }
`;

class Currency extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: undefined,
      clicked: false,
    };
    this.arrowClickHandler = this.arrowClickHandler.bind(this);
  }

  async componentDidMount() {
    const { client } = this.props;
    const { data } = await client.query({ query: DATA_QUERY, variables: {} });
    const { currencies } = data;

    this.setState({
      currencies: currencies,
    });
  }

  arrowClickHandler() {
    const { clicked } = this.state;
    this.setState({ clicked: !clicked });
  }

  clickedCurrencyHandler(currency) {
    let symbol =
      currency === "AUD"
        ? "A" + getSymbolFromCurrency(currency)
        : getSymbolFromCurrency(currency);

    this.props.currentCurrencyIcon(symbol);

    this.setState({ clicked: false });
  }

  render() {
    const { currencies } = this.state;
    const { clicked } = this.state;

    let dropDown = [];
    if (clicked)
      currencies.map((element, index) => {
        return dropDown.push(
          <p
            className={styles.DropDownElements}
            key={index}
            onClick={() => this.clickedCurrencyHandler(element)}
          >
            {element === "AUD"
              ? "A" + getSymbolFromCurrency(element) + " " + element
              : getSymbolFromCurrency(element) + " " + element}
          </p>
        );
      });

    return (
      <div>
        <p className={styles.Currency}>{this.props.currency}</p>
        <svg
          onClick={this.arrowClickHandler}
          className={styles.DownArrow}
          width="9"
          height="5"
          viewBox="0 0 8 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 0.5L4 3.5L7 0.5"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className={styles.DropDownBackground}>{dropDown}</div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currency: state.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    currentCurrencyIcon: (id) => {
      dispatch({ type: "CHANGE_ICON", id: id });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Currency);
