import { dispatch } from "rxjs/internal/observable/pairs";
import { FOCUSED_DOC_UPDATE } from "../constants/actionTypes";

const update = text => dispatch => {
  dispatch({
    type: FOCUSED_DOC_UPDATE,
    payload: {
      text
    }
  });
};

export default {
  update
};
