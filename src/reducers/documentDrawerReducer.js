import {
    FOCUSED_DOC_UPDATE,
    MAIN_OPEN_NEW_DOCUMENT
  } from "../constants/actionTypes";
  
  export default (state = {}, action) => {
    switch (action.type) {
      case FOCUSED_DOC_UPDATE:
      const newDoc = {...state[action.doc.uid]}
        return {
          ...state,
          [action.doc.uid]: {...newDoc, ...action.doc}
        };
      case MAIN_OPEN_NEW_DOCUMENT:
        return {
          ...state,
          [action.payload.doc.uid]: action.payload.doc
        };
      default:
        return state;
    }
  };
  