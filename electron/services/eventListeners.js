import { ipcMain } from "electron";

export default {
  set: () => {
      console.log('setting event listeners.')
    ipcMain.on("ping", (event, arg) => {
      const message = { title: "test", text: "this is a message" };
      console.log("sending message from Main: ", message);
      event.sender.send('pong', message);
    });
  }
};
