"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

var _fileStore = require("./fileStore");

var _default = {
  set: function set() {
    console.log("setting event listeners."); // render-to-main handshake

    _electron.ipcMain.on("ping", function (event, arg) {
      var message = {
        success: true
      };
      event.sender.send("pong", message);
    }); // open default file


    _electron.ipcMain.on("load-default-document", function (event, arg) {
      console.log("in document load event handler");
      (0, _fileStore.OpenDefaultDocument)(function (error, doc) {
        console.log("[main_eventListeners] default doc: ", doc);
        if (error) event.sender.send("document-read-error", error);else event.sender.send("main-load-document", doc);
      });
    });
  }
};
exports.default = _default;