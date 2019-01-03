"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

var _default = {
  set: function set() {
    console.log('setting event listeners.');

    _electron.ipcMain.on("ping", function (event, arg) {
      var message = {
        title: "test",
        text: "this is a message"
      };
      console.log("sending message from Main: ", message);
      event.sender.send('pong', message);
    });
  }
};
exports.default = _default;