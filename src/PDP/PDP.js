import React, { Component } from "react";
import { gql } from "@apollo/client";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";

import styles from "./PDP.module.css";
import Button from "../BUTTON/BUTTON";
import { fetchExtendedProductAsync } from "./Utils";

const PRODUCT_QUERY = gql`
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
    const productId = this.props.history.location.pathname.split("/").pop();
    const product = await fetchExtendedProductAsync(
      client,
      productId,
      PRODUCT_QUERY
    );
    this.setState({ product: product });
  }

  handleImageHover = (e) => {
    this.setState({ hoverImage: e });
    this.setState({ imageClicked: true });
  };

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
        product.gallery.map((image, index) => {
          return (
            <div key={index}>
              <img
                key={product.id}
                className={styles.ImageList}
                src={image}
                alt={product.id}
                onMouseOver={(e) => this.handleImageHover(e.currentTarget.src)}
              />

              <div className={styles.Main}>
                <img
                  key={product.id}
                  className={styles.MainImage}
                  src={!imageClicked ? product.gallery[0] : hoverImage}
                  alt={product.id}
                />
              </div>
            </div>
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
          item.items.map((element, index) => {
            return (
              <button
                onClick={() => this.attributeHandler(item.id, element.id)}
                className={styles.SizesBox}
                key={index}
                style={
                  element.value[0] === "#" && !element.isSelected
                    ? {
                        backgroundColor: element.value,
                        border: "1px solid #1d1f22",
                      }
                    : element.value[0] === "#" && element.isSelected
                    ? {
                        border: "2px solid #1d1f22",
                        backgroundColor: element.value,
                        pointerEvents: "none",
                      }
                    : element.value[0] !== "#" && element.isSelected
                    ? {
                        border: "1px solid #808080",
                        color: "#A6A6A6",
                        background: "#e8e8e8",
                        pointerEvents: "none",
                      }
                    : { border: "1px solid #1d1f22" }
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
      product.prices.forEach((item, index) => {
        if (
          item.currency === "AUD" &&
          "A" + getSymbolFromCurrency(item.currency) === this.props.currency
        ) {
          return price.push(
            <div key={index}>
              <p className={styles.price}>PRICE:</p>
              <p className={styles.PriceCurrency}>
                {this.props.currency + item.amount}
              </p>
            </div>
          );
        } else if (
          item.currency !== "AUD" &&
          getSymbolFromCurrency(item.currency) === this.props.currency
        ) {
          return price.push(
            <div key={index}>
              <p className={styles.price}>PRICE:</p>
              <p className={styles.PriceCurrency}>
                {this.props.currency + item.amount}
              </p>
            </div>
          );
        }
        return price;
      });
    }

    return (
      <div >
        <div className={styles.List}>{imageList}</div>

        {product && (
          <>
            <div className={styles.RightBar}>
              <h3 className={styles.Brand}>{product.brand}</h3>
              <h5 className={styles.Name}>{product.name}</h5>
              {renderableAttributes}
              {price}
              <Button
                styleButton={styles.Button}
                text="ADD TO CART"
                product={product}
              ></Button>

              <div
                className={styles.Description}
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
