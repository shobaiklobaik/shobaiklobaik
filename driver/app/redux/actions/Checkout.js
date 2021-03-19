export const TYPE_SAVE_CHECKOUT_DETAILS = "TYPE_SAVE_CHECKOUT_DETAILS";
export const SAVE_CART_COUNT = "SAVE_CART_COUNT";

export function saveCheckoutDetails(data) {
  return {
    type: TYPE_SAVE_CHECKOUT_DETAILS,
    value: data
  };
}

export function saveCartCount(data) {
  return {
    type: SAVE_CART_COUNT,
    value: data
  };
}

