import React, { Component } from "react";
import "./CART.css";

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
    const data = localStorage.getItem("order");
    const parsedData = data ? JSON.parse(data) : [];
    this.setState({ orderData: parsedData });
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
    const updatedorderData = orderData.map((product) => {
      if (product.id === id) {
        return { ...product, count: product.count + 1 };
      } else {
        return { ...product };
      }
    });
    localStorage.setItem("order", JSON.stringify(updatedorderData));
    this.setState({ orderData: updatedorderData });
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
    const { orderData } = this.state;
    return orderData.find(p => p.id === id);
  }

  updateProductInState = (updatedProduct) => {
    const { orderData } = this.state;
    const statedProductData = orderData.find(p => p.id === updatedProduct.id);
    const statedProductIndex = orderData.indexOf(statedProductData);
    orderData[statedProductIndex] = updatedProduct;
    this.setState(orderData);
  }
  
  leftSliderHandler = (id) => {
    const product = this.getProductFromState(id);
    let { currentPosition } = product;
    if(currentPosition > 0){
      currentPosition -= 1;
      this.updateProductInState({...product, currentPosition: currentPosition});
    }
  };
  rightSliderHandler = (id) => {
    const product = this.getProductFromState(id);
    debugger
    const { gallery } = product;
    let { currentPosition } = product;
    if(currentPosition < gallery.length - 2) {
      currentPosition += 1;
      this.updateProductInState({...product, currentPosition: currentPosition});
    }
  };

  render() {
    let itemList = [];
    const { orderData } = this.state;

    if (orderData && orderData.length > 0) {
      orderData.forEach((product) => {
        itemList.push(
          <div className="itemList-wraper" key={product.id}>
            <hr />
            <p className="brand-name">{product.brand}</p>
            <p className="item-name">{product.name}</p>
            <p className="item-price">{product.price}</p>

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
export default Cart;
