import { TYPE_SAVE_CHECKOUT_DETAILS } from "../actions/Checkout";
import { SAVE_CART_COUNT } from "../actions/Checkout";

const initalState = {
  checkoutDetail: {},
  cartCount: 0
};

export function checkoutDetailOperation(state = initalState, action) {
  switch (action.type) {
    case TYPE_SAVE_CHECKOUT_DETAILS: {
      return Object.assign({}, state, {
        checkoutDetail: action.value
        // address_id: action.value.address_id,
        // subtotal: action.value.subtotal,
        // items: action.value.items,
        // coupon_id: action.value.coupon_id,
        // coupon_type: action.value.coupon_type,
        // coupon_amount: action.value.coupon_amount,
        // user_id: action.value.user_id,
        // restaurant_id: action.value.resId
      });
    }
    case SAVE_CART_COUNT: {
      return Object.assign({}, state, {
        cartCount: action.value
      });
    }
    default:
      return state;
  }
}
