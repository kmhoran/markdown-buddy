import {
  APP_LOAD_DOC,
  APP_REQUEST_FOCUSED_DOCUMENT
} from "../constants/electronEventTypes";

class EventTriggers {
    constructor(window, errorHandler) {
    console.log("constructing event Triggers");
    this.window = window;
    this.errorHandler = errorHandler;
  }
  OpenNewDocument(doc) {
    console.log("[event triggers] opening doc: ", doc);
    this.TriggerEvent(APP_LOAD_DOC, doc);
  }

  RequestFocusedDocument() {
    this.TriggerEvent(APP_REQUEST_FOCUSED_DOCUMENT);
  }

  TriggerEvent(eventType, data = null) {
    try {
      this.window.webContents.send(eventType, data);
    } catch (err) {
      this.errorHandler(err);
    }
  }
}

module.exports = { EventTriggers };
