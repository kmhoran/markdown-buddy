import { dispatch } from "rxjs/internal/observable/pairs";
import { FOCUSED_DOC_UPDATE } from "../constants/actionTypes";

const update = doc => dispatch => {
  dispatch({
    type: FOCUSED_DOC_UPDATE,
    doc
  });
};

export default {
  update
};
