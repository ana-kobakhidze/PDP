import React, { Component } from "react";
import { connect } from "react-redux";
import "./CART.css";
import getSymbolFromCurrency from "currency-symbol-map";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: [],
    };

    this.clickHandler = this.clickHandler.bind(this);
    this.incrementHandler = this.incrementHandler.bind(this);
    this.decrementHandler = this.decrementHandler.bind(this);
    this.leftSliderHandler = this.leftSliderHandler.bind(this);
    this.rightSliderHandler = this.rightSliderHandler.bind(this);
  }

  componentDidMount() {
    this.setState({ orderData: this.props.orderData });
  }

  clickHandler = (productId, attributeId, itemId) => {
    const { orderData } = this.state;
    const updatedorderData = orderData.map((product) => {
      if (product.id === productId) {
        const updatedAttributes = product.attributes.map((attribute) => {
          if (attribute.id === attributeId) {
            const updatedItems = attribute.items.map((item) => {
              return { ...item, isSelected: item.id === itemId };
            });
            return { ...attribute, items: updatedItems };
          } else {
            return { ...attribute };
          }
        });
        return { ...product, attributes: updatedAttributes };
      } else {
        return { ...product };
      }
    });

    localStorage.setItem("order", JSON.stringify(updatedorderData));
    this.setState({ orderData: updatedorderData });
  };

  incrementHandler = (id) => {
    const { orderData } = this.state;
    const updatedOrderData = orderData.map((product) => {
      if (product.id === id) {
        return { ...product, count: product.count + 1 };
      } else {
        return { ...product };
      }
    });

    localStorage.setItem("order", JSON.stringify(updatedOrderData));
    this.setState({ orderData: updatedOrderData });
  };

  decrementHandler = (id) => {
    const { orderData } = this.state;
    const updatedorderData = orderData.map((product) => {
      if (product.id === id && product.count > 1) {
        return { ...product, count: product.count - 1 };
      } else {
        return { ...product };
      }
    });

    localStorage.setItem("order", JSON.stringify(updatedorderData));
    this.setState({ orderData: updatedorderData });
  };

  getProductFromState = (id) => {
    return this.props.orderData.find((p) => p.id === id);
  };

  leftSliderHandler = (id) => {
    const { orderData } = this.state;
    const updatedorderData = orderData.map((product) => {
      if (product.id === id && product.currentPosition > 0) {
        return { ...product, currentPosition: product.currentPosition - 1 };
      } else {
        return { ...product };
      }
    });

    localStorage.setItem("order", JSON.stringify(updatedorderData));
    this.setState({ orderData: updatedorderData });
  };

  rightSliderHandler = (id) => {
    const { orderData } = this.state;
    const updatedorderData = orderData.map((product) => {
      if (
        product.id === id &&
        product.currentPosition < product.gallery.length - 2
      ) {
        return { ...product, currentPosition: product.currentPosition + 1 };
      } else {
        return { ...product };
      }
    });

    localStorage.setItem("order", JSON.stringify(updatedorderData));
    this.setState({ orderData: updatedorderData });
  };

  render() {
    let itemList = [];
    const { orderData } = this.state;

    if (orderData) {
      orderData.forEach((product) => {
        itemList.push(
          <div className="itemList-wraper" key={product.id}>
            <hr />
            <p className="brand-name">{product.brand}</p>
            <p className="item-name">{product.name}</p>

            <p className="item-price">
              {product.prices.map((price) => {
                let currentPriceCurrency;
                if (
                  price.currency === "AUD" &&
                  "A" + getSymbolFromCurrency(price.currency) ===
                    this.props.currency
                ) {
                  currentPriceCurrency = this.props.currency + price.amount;
                } else if (
                  price.currency !== "AUD" &&
                  getSymbolFromCurrency(price.currency) === this.props.currency
                ) {
                  currentPriceCurrency = this.props.currency + price.amount;
                }
                return currentPriceCurrency;
              })}
            </p>

            {product.attributes &&
              product.attributes.map((attribute) => {
                let attributeRenderableItems = [];
                const renderableItems = attribute.items.map((item) => {
                  return (
                    <button
                      className="buttonForAttribute"
                      onClick={() =>
                        this.clickHandler(product.id, attribute.id, item.id)
                      }
                      style={
                        item.value[0] === "#" && !item.isSelected
                          ? {
                              background: item.value,
                              border: "1px solid #1d1f22",
                            }
                          : item.value[0] === "#" && item.isSelected
                          ? {
                              border: "2px solid #1d1f22",
                              background: item.value,
                            }
                          : item.value[0] !== "#" && item.isSelected
                          ? {
                              border: "1px solid #808080",
                              color: "#808080",
                              pointerEvents: "none",
                            }
                          : { border: "1px solid #1d1f22" }
                      }
                    >
                      {item.value[0] === "#" ? null : item.value}
                    </button>
                  );
                });
                attributeRenderableItems.push(
                  <div className="category-attributes-wraper">
                    {renderableItems}
                  </div>
                );
                return attributeRenderableItems;
              })}

            <button
              className="plus-box"
              onClick={() => this.incrementHandler(product.id)}
            ></button>

            <svg
              className="vertical"
              width="1"
              height="17"
              viewBox="0 0 1 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.5 1V16"
                stroke="#1D1F22"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              className="horizontal"
              width="17"
              height="1"
              viewBox="0 0 17 1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 0.5H16"
                stroke="#1D1F22"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="count">{product.count}</p>
            <button
              className="minus-box"
              onClick={() => this.decrementHandler(product.id)}
            ></button>
            <svg
              className="horizontal-minus"
              width="17"
              height="1"
              viewBox="0 0 17 1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 0.5H16"
                stroke="#1D1F22"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <img
              className="product-image"
              src={product.gallery[product.currentPosition]}
              alt="product"
            />
            <svg
              onClick={() => this.leftSliderHandler(product.id)}
              className="left-arrow"
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 13L1 7L7 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              className="right-arrow"
              onClick={() => this.rightSliderHandler(product.id)}
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 13L7 7L1 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      });
    }

    return (
      <div>
        <h1 className="cart-title">CART</h1>
        {itemList}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currency: state.currency,
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
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
