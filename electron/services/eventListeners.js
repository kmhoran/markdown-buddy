import { ipcMain } from "electron";
import { OpenDefaultDocument } from "./fileStore";

export default {
  set: () => {
    console.log("setting event listeners.");
    // render-to-main handshake
    ipcMain.on("ping", (event, arg) => {
      const message = { success: true };
      event.sender.send("pong", message);
    });

    // open default file
    ipcMain.on("load-default-document", (event, arg) => {
      console.log("in document load event handler");
      OpenDefaultDocument((error, doc) => {
        console.log("[main_eventListeners] default doc: ", doc);
        if (error) event.sender.send("document-read-error", error);
        else event.sender.send("main-load-document", doc);
      });
    });
  }
};
