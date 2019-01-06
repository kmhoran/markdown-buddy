"use strict";

var _electronEventTypes = require("../constants/electronEventTypes");

class EventTriggers {
  constructor(window, errorHandler) {
    console.log("constructing event Triggers");
    this.window = window;
    this.errorHandler = errorHandler;
  }

  OpenNewDocument(doc) {
    console.log("[event triggers] opening doc: ", doc);
    this.TriggerEvent(_electronEventTypes.APP_LOAD_DOC, doc);
  }

  RequestFocusedDocument() {
    this.TriggerEvent(_electronEventTypes.APP_REQUEST_FOCUSED_DOCUMENT);
  }

  TriggerEvent(eventType, data = null) {
    try {
      this.window.webContents.send(eventType, data);
    } catch (err) {
      this.errorHandler(err);
    }
  }

}

module.exports = {
  EventTriggers
};