import { MAIN_HANDSHAKE_ACK } from "../constants/actionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case MAIN_HANDSHAKE_ACK:
      return {
        connected: true,
        timestamp: action.payload.timestamp
      };
    default:
      return state;
  }
};
