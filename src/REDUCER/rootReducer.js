import { ACTION_TYPES } from '../Constants';

const initialState = {
  currency: "$",
  showModal: false,
  orderData: JSON.parse(localStorage.getItem('order')) || []
};

function rootReducer(state = initialState, action) {
  switch(action.type){
    case ACTION_TYPES.CHANGE_ICON : { return {...state, currency: action.id,}; }
    case ACTION_TYPES.SHOW_MODAL : { return {...state,showModal: !state.showModal }; }
    case ACTION_TYPES.SHOW_ITEM_QUANTITY : { return {...state, orderQuantity: action.quantity }; }
    case ACTION_TYPES.SAVE_ORDER_DATA : { return {...state, orderData: action.data }; }
    default: 
      return state;
    }
}

export default rootReducer;
