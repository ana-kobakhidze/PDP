import "./App.css";
import React, { Component } from "react";
import Header from './HEADER/HEADER';
import CATEGORY from './CATEGORY/CATEGORY';
import PDP from '../src/PDP/PDP'
import CART from '../src/CART/CART';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends Component {

  render() {
    return (
      <Router>
       <div className="app">
       <Header client={ this.props.client }/>
       <Switch>
          <Route exact path="/">
          <CATEGORY />
          </Route>
          <Route path="/men">
          <p>Category</p>
          </Route>
          <Route path="/kids">
          <p>Kids Category</p>
          </Route>
          <Route path="/women">
          <PDP client={ this.props.client }/>
          </Route>
          <Route path="/cart">
          <CART/>
          </Route>
          
        </Switch>
        
        
      </div>
      </Router>
    );
  }
}

export default App;
