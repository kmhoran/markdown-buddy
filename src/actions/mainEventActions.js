import { dispatch } from "rxjs/internal/observable/pairs";
import { MAIN_HANDSHAKE_ACK } from "../constants/actionTypes";

const markHandshakeComplete = () => dispatch => {
  dispatch({
    type: MAIN_HANDSHAKE_ACK,
    payload: {
        timestamp: new Date().toISOString()
    }
  });
};

export default {
  update
};
