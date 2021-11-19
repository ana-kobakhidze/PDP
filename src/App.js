import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";

import Header from "./HEADER/HEADER";
import CATEGORY from "./CATEGORY/CATEGORY";
import PDP from "../src/PDP/PDP";
import CART from "../src/CART/CART";

import { TAB_NAMES } from "./Constants";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Header client={this.props.client} />
          <Switch>
            <Route exact path="/">
              <CATEGORY client={this.props.client} />
            </Route>
            <Route path={"/" + TAB_NAMES.MEN}></Route>
            <Route path={"/" + TAB_NAMES.KIDS}></Route>
            <Route path={"/" + TAB_NAMES.WOMEN}>
              <PDP client={this.props.client} />
            </Route>
            <Route path="/cart">
              <CART />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
