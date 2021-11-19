import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import styles from "./MODAL.module.css";
import getSymbolFromCurrency from "currency-symbol-map";

//TODO: Merge with Cart.js as they have the same body except maybe render
class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderData: [],
      redirect: false,
    };

    this.attributeSelectionHandler = this.attributeSelectionHandler.bind(this);
    this.incrementHandler = this.incrementHandler.bind(this);
    this.decrementHandler = this.decrementHandler.bind(this);
    this.leftSliderHandler = this.leftSliderHandler.bind(this);
    this.rightSliderHandler = this.rightSliderHandler.bind(this);
  }

  componentDidMount() {
    this.setState({ orderData: this.props.orderData });
  }

  saveOrder = (updatedOrderData) => {
    localStorage.setItem("order", JSON.stringify(updatedOrderData));
    this.setState({ orderData: updatedOrderData });
    this.props.saveOrderData(updatedOrderData);
  };

  attributeSelectionHandler = (productId, attributeId, itemId) => {
    const { orderData } = this.state;
    //find attribute in object tree, go back and update each node
    const updatedOrderData = orderData.map((product) => {
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
    this.saveOrder(updatedOrderData);
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

    this.saveOrder(updatedOrderData);
  };

  decrementHandler = (id) => {
    const { orderData } = this.state;
    const updatedOrderData = orderData.map((product) => {
      if (product.id === id && product.count > 1) {
        return { ...product, count: product.count - 1 };
      } else {
        return { ...product };
      }
    });

    this.saveOrder(updatedOrderData);
  };

  getProductFromState = (id) => {
    return this.props.orderData.find((p) => p.id === id);
  };

  leftSliderHandler = (id) => {
    const { orderData } = this.state;
    const updatedOrderData = orderData.map((product) => {
      if (product.id === id && product.currentPosition > 0) {
        return { ...product, currentPosition: product.currentPosition - 1 };
      } else {
        return { ...product };
      }
    });

    this.saveOrder(updatedOrderData);
  };

  rightSliderHandler = (id) => {
    const { orderData } = this.state;
    const updatedOrderData = orderData.map((product) => {
      if (
        product.id === id &&
        product.currentPosition < product.gallery.length - 2
      ) {
        return { ...product, currentPosition: product.currentPosition + 1 };
      } else {
        return { ...product };
      }
    });

    this.saveOrder(updatedOrderData);
  };

  redirectButtonHandler = () => {
    const { redirect } = this.state;
    this.setState({ redirect: !redirect });
  };

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to="/cart" />;
    }
    let itemList = [];
    const { orderData } = this.state;

    if (orderData) {
      orderData.forEach((product, index) => {
        itemList.push(
          <div className={styles.OrderList} key={index}>
            <p className={styles.NameOfBrand}>{product.brand}</p>
            <p className={styles.NameOfProduct}>{product.name}</p>

            <p className={styles.PriceOfProduct}>
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
                const renderableItems = attribute.items.map((item, index) => {
                  return (
                    <button
                      key={index}
                      className={styles.AttributeButton}
                      onClick={() =>
                        this.attributeSelectionHandler(
                          product.id,
                          attribute.id,
                          item.id
                        )
                      }
                      style={
                        item.value[0] === "#" && !item.isSelected
                          ? {
                              background: item.value,
                              border: "1px solid #1d1f22",
                              width: "24px",
                            }
                          : item.value[0] === "#" && item.isSelected
                          ? {
                              border: "2px solid #1d1f22",
                              background: item.value,
                              width: "24px",
                            }
                          : item.value[0] !== "#" && item.isSelected
                          ? {
                              border: "1px solid #808080",
                              color: "#A6A6A6",
                              background: "#e8e8e8",
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
                  <div className={styles.AttributesWraper} key={index}>
                    {renderableItems}
                  </div>
                );
                return attributeRenderableItems;
              })}

            <button
              className={styles.AddButton}
              onClick={() => this.incrementHandler(product.id)}
            ></button>

            <svg
              className={styles.VerticalLine}
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
              className={styles.HorizontalLine}
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
            <p className={styles.Counter}>{product.count}</p>
            <button
              className={styles.SubtrBox}
              onClick={() => this.decrementHandler(product.id)}
            ></button>
            <svg
              className={styles.SubtrHorizontalLine}
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
              className={styles.ProductGallery}
              src={product.gallery[product.currentPosition]}
              alt="product"
            />
          </div>
        );
      });
    }
    //TODO: Move it function
    let priceArray = [];
    if (orderData && orderData.length > 0)
      orderData.forEach((product) => {
        product.prices.map((price) => {
          if (
            price.currency === "AUD" &&
            "A" + getSymbolFromCurrency(price.currency) === this.props.currency
          ) {
            priceArray.push(price.amount * product.count);
          } else if (
            price.currency !== "AUD" &&
            getSymbolFromCurrency(price.currency) === this.props.currency
          ) {
            priceArray.push(price.amount * product.count);
          }
          return priceArray;
        });
      });

    let totalPrice;
    if (priceArray.length > 0) {
      const reducer = (accumulator, priceArray) => accumulator + priceArray;
      totalPrice = this.props.currency + priceArray.reduce(reducer).toFixed(2);
    }

    return (
      <div className={styles.Modal}>
        <div className={styles.ModalWindow}>
          <h1 className={styles.CartHeadline}>My Bag,</h1>
          <p className={styles.ItemQuantity}>{this.props.orderQuantity} items</p>
          {itemList}
          <p className={styles.Total}>Total:</p>
          <p className={styles.TotalNumber}>{totalPrice}</p>
          <button
            className={styles.BtnForCart}
            onClick={() => this.redirectButtonHandler()}
          >
            VIEW BAG
          </button>
          <button
            className={styles.BtnCheckOut}
            onClick={() => this.props.displayModal()}
          >
            CHECK OUT
          </button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    showModal: state.showModal,
    orderData: state.orderData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    displayModal: () => {
      dispatch({ type: "SHOW_MODAL" });
    },
    saveOrderData: (order) => {
      dispatch({ type: "SAVE_ORDER_DATA", data: order });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
