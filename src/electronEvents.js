// window.ipcRenderer is provided in ~/electron/preload.js
// this file will not run outside of electron

export function SetElectronListeners() {
  // test event listeners
  window.ipcRenderer.on('pong', (event, message) => {
    console.log("Heard event: ", message);
  });
}

export function PingMainProcess(){
    window.ipcRenderer.send('ping')
}