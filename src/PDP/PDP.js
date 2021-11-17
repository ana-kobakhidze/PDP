import React, { Component } from "react";
import { gql } from "@apollo/client";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";

import "./PDP.css";
import Button from "../BUTTON/BUTTON";



const DATA_QUERY = gql`
  query ($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      prices {
        currency
        amount
      }
      brand
    }
  }
`;

class PDP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: undefined,
      hoverImage: "",
      imageClicked: false,
    };
  }

  async componentDidMount() {
    const { client } = this.props;
    // history useHistory need to be changed
    let history = this.props.history;
    let string = history.location.pathname.split("/");
    string = string[string.length - 1];
    //quering product data from server
    const { data } = await client.query({
      query: DATA_QUERY,
      variables: {
        id: string,
      },
    });

    let { product } = data;
    //extend product with count option
    product = this.extendProduct(product);
    //extend attributes with isSelected option
    product = this.extendAttributes(product);
    this.setState({ product: product });
  }

  // extendAttributes
  extendAttributes = (product) => {
    const extendedAttributes = product.attributes.map((attribute) => {
      const extendedItems = attribute.items.map((item) => {
        return { ...item, isSelected: false };
      });
      return { ...attribute, items: extendedItems };
    });
    return { ...product, attributes: extendedAttributes };
  };

  //extend  with count property
  extendProduct = (product) => {
    //count is needed for cart
    return { ...product, count: 1, currentPosition: 0 };
  };

  // handling image hover
  handleClick = (e) => {
    this.setState({ hoverImage: e });
    this.setState({ imageClicked: true });
  };
  priceHandler() {}

  //handling data in state
  attributeHandler = (parentId, attributeId) => {
    const { product } = this.state;
    const attributeParent = product.attributes.find(
      (parent) => parent.id === parentId
    );
    attributeParent.items.forEach((i) => {
      i.isSelected = i.id === attributeId;
    });
    this.setState({ product });
  };

  render() {
    const { product, imageClicked, hoverImage } = this.state;

    const imageList = [];
    if (product) {
      imageList.push(
        product.gallery.map((image) => {
          return (
            <>
              <img
                key={image}
                className="image-list"
                src={image}
                alt={product.id}
                onMouseOver={(e) => this.handleClick(e.currentTarget.src)}
              />

              <div className="main">
                <img
                  className="main-image"
                  src={!imageClicked ? product.gallery[0] : hoverImage}
                  alt={product.id}
                />
              </div>
            </>
          );
        })
      );
    }

    let renderableAttributes = [];
    if (product && product.attributes.length >= 1) {
      product.attributes.forEach((item) => {
        renderableAttributes.push(
          <p className="size" key={item.id}>
            {item.name.toUpperCase() + ":"}
          </p>,
          item.items.map((element) => {
            return (
              <button
                onClick={() => this.attributeHandler(item.id, element.id)}
                className="sizes-box"
                key={element.id}
                onMouseEnter={(e) => {
                  item.name === "Color"
                    ? (e.target.style.backgroundColor = element.value)
                    : (e.target.style.backgroundColor = "black");
                }}
                onMouseLeave={(e) => {
                  item.name === "Color"
                    ? (e.target.style.backgroundColor = element.value)
                    : (e.target.style.backgroundColor = "white");
                }}
                style={
                  item.name === "Color"
                    ? { backgroundColor: element.value }
                    : { backgroundColor: "white" }
                }
              >
                {item.name === "Color" ? null : element.value}
              </button>
            );
          })
        );
      });
    }

    let price = [];
    if (product) {
      product.prices.forEach((item) => {
        if (
          item.currency === "AUD" &&
          "A" + getSymbolFromCurrency(item.currency) === this.props.currency
        ) {
          return price.push(
            <>
              <p className="price">PRICE:</p>
              <p className="price-currency">
                {this.props.currency + item.amount}
              </p>
            </>
          );
        } else if (
          item.currency !== "AUD" &&
          getSymbolFromCurrency(item.currency) === this.props.currency
        ) {
          return price.push(
            <>
              <p className="price">PRICE:</p>
              <p className="price-currency">
                {this.props.currency + item.amount}
              </p>
            </>
          );
        }
        return price;
      });
    }

    return (
      <div className="pdp">
        <div className="list">{imageList}</div>

        {product && (
          <>
            <div className="right-bar">
              <h3 className="brand">{product.brand}</h3>
              <h5 className="name">{product.name}</h5>
              {renderableAttributes}
              {price}
              <Button
                styleButton="button"
                text="ADD TO CART"
                product={product}
              ></Button>

              <div
                className="description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currency: state.currency,
  };
};

export default connect(mapStateToProps)(withRouter(PDP));
