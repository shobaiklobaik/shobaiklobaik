
import { TYPE_SAVE_ORDER_DETAILS } from "../actions/Order";
    
    const initialStateUser = {
      
    };
    
    export function orderOperations(state = initialStateUser, action) {
      switch (action.type) {
        case TYPE_SAVE_ORDER_DETAILS: {
          return Object.assign({}, state, {
            orderData: action.value
          });
        }
        default:
      return state;
  }
}