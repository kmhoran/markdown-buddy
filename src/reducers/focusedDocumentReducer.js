import { FOCUSED_DOC_UPDATE } from "../constants/actionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case FOCUSED_DOC_UPDATE:
      return {
        text: action.payload.text
      };
    default:
      return state;
  }
};
