import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { gql } from "@apollo/client";
import styles from "./CATEGORYLINKS.module.css";

const DATA_QUERY = gql`
  query {
    categories {
      name
    }
  }
`;

class CategoryLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryNames: undefined,
      clickedTab: "",
    };
  }
  async componentDidMount() {
    const { client } = this.props;
    const { data } = await client.query({ query: DATA_QUERY, variables: {} });
    let { categories } = data;
    this.setState({ categoryNames: categories });
  }

  tabClickHandler = (index, name) => {
    this.setState({ clickedTab: index });
    this.props.currentTabName(name);
    this.props.currentCartClick("TAB_IS_CLICKED");
  };
  render() {
    const { categoryNames, clickedTab } = this.state;
    let navigationList = [];
    if (categoryNames) {
      navigationList.push(
        categoryNames.map((item, index) => {
          return (
            <Link
              to={"/" + item.name}
              key={index}
              className={
                clickedTab !== index ? styles.Link : styles.ClickedLink
              }
              onClick={() => {
                this.tabClickHandler(index, item.name);
              }}
            >
              {item.name}
            </Link>
          );
        })
      );
    }
    return (
      <>
        <nav className={styles.HeaderNav}>{navigationList}</nav>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    tabName: state.tabName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    currentTabName: (name) => dispatch({ type: "SAVE_TABNAME", tabName: name }),
    currentCartClick: (event) =>
      dispatch({ type: "SAVE_CARTICON_CLICK", clicked: event }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CategoryLinks);
