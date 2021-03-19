

export const TYPE_SAVE_ORDER_DETAILS = "TYPE_SAVE_ORDER_DETAILS"
export function saveOrderDetailsInRedux(details) {
    return {
        type: TYPE_SAVE_ORDER_DETAILS,
        value: details
    }
}