import {
  FOCUSED_DOC_UPDATE,
  MAIN_OPEN_NEW_DOCUMENT
} from "../constants/actionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case FOCUSED_DOC_UPDATE:
      return {
        ...state,
        ...action.doc
      };
    case MAIN_OPEN_NEW_DOCUMENT:
      return {
        ...action.payload.doc
      };
    default:
      return state;
  }
};
