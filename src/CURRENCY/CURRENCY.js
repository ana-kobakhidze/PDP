import React, { Component } from "react";
import { gql } from "@apollo/client";
import "./CURRENCY.css";

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
      clicked: false
    };
    this.arrowClickHandler = this.arrowClickHandler.bind(this);
  }

  async componentDidMount() {
    const { client } = this.props;
    const { data } = await client.query({ query: DATA_QUERY, variables: {} });
    const { currencies } = data;
    this.setState({ currencies: currencies });
  }
  arrowClickHandler() {
    const { clicked } = this.state;
     this.setState({clicked: !clicked })
  }

  render() {
    const { currencies } = this.state;
    const { clicked } = this.state;
    let dropDown = [];
    
    if(clicked)
    currencies.map((element) => {
      return (dropDown.push (
        
          <p className="dropDown-elements">{element}</p>
        
      ));
    });
    dropDown.push( <div className="dropDown-background">
    {dropDown}
  </div>);
    console.log(dropDown)
    
  
    return (
      <div>
        <p className="currency">$</p>
        <svg
          onClick={this.arrowClickHandler}
          className="down_arrow"
          width="8"
          height="4"
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
        {dropDown}
      </div>
    );
  }
}

export default Currency;
