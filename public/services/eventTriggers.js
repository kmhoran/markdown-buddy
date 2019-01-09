"use strict";

var _electronEventTypes = require("../constants/electronEventTypes");

class EventTriggers {
  constructor(window, errorHandler) {
    this.window = window;
    this.errorHandler = errorHandler;
  }

  OpenNewDocument(doc) {
    this.TriggerEvent(_electronEventTypes.APP_MAIN_LOAD_DOC, doc);
  }

  RequestFocusedDocument() {
    this.TriggerEvent(_electronEventTypes.APP_MAIN_REQUEST_FOCUSED_DOCUMENT);
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