// window.ipcRenderer is provided in ~/electron/preload.js
// this file will not run outside of electron
import {
  MAIN_HANDSHAKE_ACK,
  MAIN_OPEN_NEW_DOCUMENT,
  INTERNAL_ERROR
} from "./constants/actionTypes";
import {
  APP_MAIN_LOAD_DOC,
  APP_MAIN_DOCUMENT_READ_ERROR,
  APP_RENDER_LOAD_DEFAULT_DOC,
  APP_MAIN_REQUEST_FOCUSED_DOCUMENT,
  APP_RENDER_RETURN_FOCUSED_DOCUMENT,
  APP_MAIN_FINISH_SAVING_DOCUMENT,
  APP_MAIN_DOCUMENT_SAVE_ERROR,
  PING,
  PONG
} from "./constants/electronEventTypes";

export function SetElectronListeners(callbacks) {
  // test event listeners
  window.ipcRenderer.on(PONG, (event, message) => {
    if (callbacks[MAIN_HANDSHAKE_ACK]) callbacks[MAIN_HANDSHAKE_ACK]();

    // display opened document
    window.ipcRenderer.on(APP_MAIN_LOAD_DOC, (event, doc) => {
      if (callbacks[MAIN_OPEN_NEW_DOCUMENT])
        callbacks[MAIN_OPEN_NEW_DOCUMENT](doc);
    });

    // return focused document
    window.ipcRenderer.on(APP_MAIN_REQUEST_FOCUSED_DOCUMENT, event => {
      if (!callbacks[APP_RENDER_RETURN_FOCUSED_DOCUMENT]) return;
      const doc = callbacks[APP_RENDER_RETURN_FOCUSED_DOCUMENT]();
      window.ipcRenderer.send(APP_RENDER_RETURN_FOCUSED_DOCUMENT, doc);
    });

    // finish saving document
    window.ipcRenderer.on(APP_MAIN_FINISH_SAVING_DOCUMENT, (event, doc) => {
      if (callbacks[MAIN_OPEN_NEW_DOCUMENT])
        callbacks[MAIN_OPEN_NEW_DOCUMENT](doc);
    });
  });
}

export function PingMainProcess() {
  window.ipcRenderer.send(PING);
}

export function LoadDefaultDocument() {
  window.ipcRenderer.send(APP_RENDER_LOAD_DEFAULT_DOC);
}
