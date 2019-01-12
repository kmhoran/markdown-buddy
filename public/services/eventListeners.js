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
    // render-to-main handshake
    _electron.ipcMain.on(_electronEventTypes.PING, (event, arg) => {
      const message = {
        success: true
      };
      event.sender.send(_electronEventTypes.PONG, message);
    }); // open default file


    _electron.ipcMain.on(_electronEventTypes.APP_RENDER_LOAD_DEFAULT_DOC, (event, arg) => {
      (0, _fileStore.OpenDefaultDocument)((error, doc) => {
        if (error) event.sender.send(_electronEventTypes.APP_MAIN_DOCUMENT_READ_ERROR, error);else event.sender.send(_electronEventTypes.APP_MAIN_LOAD_DOC, doc);
      });
    }); // save the focused document


    _electron.ipcMain.on(_electronEventTypes.APP_RENDER_RETURN_FOCUSED_DOCUMENT, (event, doc) => {
      (0, _fileStore.SaveDocument)(doc, (err, doc) => {
        if (err) event.sender.send(_electronEventTypes.APP_MAIN_DOCUMENT_SAVE_ERROR, err);else event.sender.send(_electronEventTypes.APP_MAIN_FINISH_SAVING_DOCUMENT, doc);
      });
    });
  }
};
exports.default = _default;