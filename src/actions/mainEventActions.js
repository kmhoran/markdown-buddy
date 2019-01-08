import { dispatch } from "rxjs/internal/observable/pairs";
import {
  MAIN_HANDSHAKE_ACK,
  MAIN_OPEN_NEW_DOCUMENT
} from "../constants/actionTypes";

const markHandshakeComplete = () => dispatch => {
  dispatch({
    type: MAIN_HANDSHAKE_ACK,
    payload: {
      timestamp: new Date().toISOString()
    }
  });
};

const openNewDocument = doc => dispatch => {
  dispatch({
    type: MAIN_OPEN_NEW_DOCUMENT,
    payload: { doc }
  });
};

export default {
  markHandshakeComplete,
  openNewDocument
};
