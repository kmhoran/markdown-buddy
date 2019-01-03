import { combineReducers } from "redux";
import focusedDocumentReducer from "./focusedDocumentReducer";
import mainEventReducer from "./mainEventReducer";

export default combineReducers({
  focused: focusedDocumentReducer,
  main: mainEventReducer 
});
