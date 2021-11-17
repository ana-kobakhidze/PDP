const initialState = {
  currency: "$",
  showModal: false,
  orderData: JSON.parse(localStorage.getItem('order')) || []
};

function rootReducer(state = initialState, action) {
  if (action.type === "CHANGE_ICON") {
    return {
      ...state,
      currency: action.id,
    };
  }
  else if (action.type === "SHOW_MODAL"){
    const { showModal } = state;
    return {
      ...state,
      showModal: !showModal
    }
  }
  else if( action.type === 'SHOW_ITEM_QUANTITY'){
    return{
      ...state,
      orderQuantity: action.quantity

    }
  }
  else if( action.type === 'SAVE_ORDER_DATA'){
  
    // const { orderData } = state;
    // orderData.push( action.data)
    // const productIndexInOrder = orderData.findIndex(o => o.id === action.data.id);
    // // debugger
    // productIndexInOrder > 0 ? orderData[productIndexInOrder] = action.data : orderData.push(action.data);
    return{
      ...state,
      orderData: action.data

    }
  }
 
  return state;
}

export default rootReducer;
