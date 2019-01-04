"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

var _fileStore = require("./fileStore");

var _electronEventTypes = require("../constants/electronEventTypes");

var _default = {
  set: () => {
    console.log("setting event listeners."); // render-to-main handshake

    _electron.ipcMain.on(_electronEventTypes.PING, (event, arg) => {
      const message = {
        success: true
      };
      event.sender.send(_electronEventTypes.PONG, message);
    }); // open default file


    _electron.ipcMain.on(_electronEventTypes.APP_LOAD_DEFAULT_DOC, (event, arg) => {
      (0, _fileStore.OpenDefaultDocument)((error, doc) => {
        if (error) event.sender.send(_electronEventTypes.APP_DOCUMENT_READ_ERROR, error);else event.sender.send(_electronEventTypes.APP_LOAD_DOC, doc);
      });
    });
  }
};
exports.default = _default;