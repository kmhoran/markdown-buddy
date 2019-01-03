import {
  FOCUSED_DOC_UPDATE,
  MAIN_OPEN_NEW_DOCUMENT
} from "../constants/actionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case FOCUSED_DOC_UPDATE:
      return {
        text: action.payload.text
      };
    case MAIN_OPEN_NEW_DOCUMENT:
      console.log("focus reducer loaded: ", action.payload.doc);
      const { text, type, isDefault } = action.payload.doc;
      return {
        text,
        type,
        isDefault
      };
    default:
      return state;
  }
};
