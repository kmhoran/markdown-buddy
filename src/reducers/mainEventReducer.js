import {
  MAIN_HANDSHAKE_ACK, MAIN_OPEN_NEW_DOCUMENT
} from "../constants/actionTypes";

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
