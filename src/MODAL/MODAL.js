import React, { Component } from "react";
import { connect } from 'react-redux';
import "./MODAL.css";
import getSymbolFromCurrency from 'currency-symbol-map';
import Button from '../BUTTON/BUTTON';

class Modal  extends Component {
    constructor(props) {
      super(props);
      this.state = {
        // orderData: [],
        exitModal: this.props.showModal
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
      this.props.saveOrderData(parsedData);
      console.log(this.props.orderData)
      // this.setState({ orderData: parsedData });
    }
  
    clickHandler = (productId, attributeId, itemId) => {
      
      const updatedorderData = this.props.orderData.map((product) => {
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
      this.props.saveOrderData(updatedorderData)
      // this.setState({ orderData: updatedorderData });
    };
  
    incrementHandler = (id) => {
      
      const updatedorderData = this.props.orderData.map((product) => {
        if (product.id === id) {
          return { ...product, count: product.count + 1 };
        } else {
          return { ...product };
        }
      });
      localStorage.setItem("order", JSON.stringify(updatedorderData));
      // this.setState({ orderData: updatedorderData });
      this.props.saveOrderData(updatedorderData);
    };
  
    decrementHandler = (id) => {
    
      const updatedorderData = this.props.orderData.map((product) => {
        if (product.id === id && product.count > 1) {
          return { ...product, count: product.count - 1 };
        } else {
          return { ...product };
        }
      });
      localStorage.setItem("order", JSON.stringify(updatedorderData));
      // this.setState({ orderData: updatedorderData });
      this.props.saveOrderData(updatedorderData);
    };
  
    getProductFromState = (id) => {
      return this.props.orderData.find(p => p.id === id);
    }
  
    updateProductInState = (updatedProduct) => {
      
      const statedProductData = this.props.orderData.find(p => p.id === updatedProduct.id);
      const statedProductIndex = this.props.orderData.indexOf(statedProductData);
      this.props.orderData[statedProductIndex] = updatedProduct;
      this.props.saveOrderData(this.props.orderData);
      //this.setState(orderData);
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
      
      const { gallery } = product;
      let { currentPosition } = product;
      if(currentPosition < gallery.length - 2) {
        currentPosition += 1;
        this.updateProductInState({...product, currentPosition: currentPosition});
      }
    };
  
    render() {
     
      let itemList = [];
      if (this.props.orderData) {
        this.props.orderData.forEach((product) => {
          
          itemList.push(
            <div className="orderList" key={product.id}>
              <p className="nameOfBrand">{product.brand}</p>
              <p className="nameOfProduct">{product.name}</p>
              
              <p className="priceOfProduct">{product.prices.map(price => {
                
                
                let currentPriceCurrency;
                if( price.currency === "AUD" &&  'A' + getSymbolFromCurrency(price.currency) === this.props.currency){
                  currentPriceCurrency =  this.props.currency + price.amount
                }
                else if( price.currency !== "AUD" && getSymbolFromCurrency(price.currency) === this.props.currency){
                  currentPriceCurrency = this.props.currency + price.amount
                }
                return currentPriceCurrency;
                
              })}</p>
  
              {product.attributes &&
                product.attributes.map((attribute) => {
                  let attributeRenderableItems = [];
                  const renderableItems = attribute.items.map((item) => {
                    return (
                      <button
                        className="attributeButton"
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
                    <div className="attributesWraper">
                      {renderableItems}
                    </div>
                  );
                  return attributeRenderableItems;
                })}
  
              <button
                className="addButton"
                onClick={() => this.incrementHandler(product.id)}
              ></button>
  
              <svg
                className="verticalLine"
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
                className="horizontalLine"
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
              <p className="counter">{product.count}</p>
              <button
                className="subtrBox"
                onClick={() => this.decrementHandler(product.id)}
              ></button>
              <svg
                className="subtrHorizontalLine"
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
                className="productGallery"
                src={product.gallery[product.currentPosition]}
                alt="product"
              />
             
            </div>
          );
        });
      }

      let priceArray = [];
      if (this.props.orderData && this.props.orderData.length > 0)
      this.props.orderData.forEach(product =>
      {product.prices.map(price => {
        if( price.currency === "AUD" &&  'A' + getSymbolFromCurrency(price.currency) === this.props.currency){
          priceArray.push
          (price.amount * product.count)
      }
      else if( price.currency !== "AUD" && getSymbolFromCurrency(price.currency) === this.props.currency){
        priceArray.push
        (price.amount * product.count)
      }
        return priceArray;
      })})

      let totalPrice;
      if(priceArray.length > 0){
        const reducer = (accumulator, priceArray) => accumulator + priceArray;
        totalPrice = this.props.currency + priceArray.reduce(reducer).toFixed(2)
      }
    
      return (
        <div className='modal'>
        <div className='modal-Window'>
          <h1 className="cart-headline">My Bag,</h1>
          {itemList}
          <p className="total">Total:</p>
          <p className="totalNumber">{totalPrice}</p>
          <Button styleButton='btnForCart' text='VIEW BAG' product={this.props.orderData}></Button>
          <button className='btnCheckOut' onClick={() => this.props.displayModal()} >CHECK OUT</button>
          </div>
        </div>
      );
    }
  }
  const mapStateToProps = (state) => {
    return {
      currency: state.currency,
      showModal: state.showModal,
      orderData: state.orderData
    }
  }
  const mapDispatchToProps = (dispatch) => {
    return{
      displayModal: () => {dispatch({type: "SHOW_MODAL"})},
      saveOrderData: (order) => {dispatch({type: 'SAVE_ORDER_DATA', data: order})}
    }
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
