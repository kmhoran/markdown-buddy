import { combineReducers } from "redux";
import focusedDocumentReducer from "./focusedDocumentReducer";
import mainEventReducer from "./mainEventReducer";
import documentDrawerReducer from "./documentDrawerReducer";

export default combineReducers({
  focused: focusedDocumentReducer,
  main: mainEventReducer,
  drawer: documentDrawerReducer
});
