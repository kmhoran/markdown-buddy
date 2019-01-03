"use strict";

var _require = require("electron"),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    shell = _require.shell,
    ipcMain = _require.ipcMain,
    Menu = _require.Menu,
    TouchBar = _require.TouchBar;

var TouchBarButton = TouchBar.TouchBarButton,
    TouchBarLabel = TouchBar.TouchBarLabel,
    TouchBarSpacer = TouchBar.TouchBarSpacer;

var _require2 = require("./services/fileStore"),
    OpenFile = _require2.OpenFile,
    OpenDefaultDocument = _require2.OpenDefaultDocument;

var eventListeners = require("./services/eventListeners");

var path = require("path");

var isDev = require("electron-is-dev");

var errorHandler = function errorHandler(error) {
  console.log("!!! ERROR: ", error);
};

var mainWindow;

var createWindow = function createWindow() {
  mainWindow = new BrowserWindow({
    backgroundColor: "#F7F7F7",
    minWidth: 880,
    show: false,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/preload.js"
    },
    height: 860,
    width: 1280
  });
  mainWindow.loadURL(isDev ? "http://localhost:3000" : "file://".concat(path.join(__dirname, "../build/index.html")));

  if (isDev) {
    var _require3 = require("electron-devtools-installer"),
        installExtension = _require3.default,
        REACT_DEVELOPER_TOOLS = _require3.REACT_DEVELOPER_TOOLS,
        REDUX_DEVTOOLS = _require3.REDUX_DEVTOOLS;

    installExtension(REACT_DEVELOPER_TOOLS).then(function (name) {
      console.log("Added Extension: ".concat(name));
    }).catch(function (err) {
      console.log("An error occurred: ", err);
    });
    installExtension(REDUX_DEVTOOLS).then(function (name) {
      console.log("Added Extension: ".concat(name));
    }).catch(function (err) {
      console.log("An error occurred: ", err);
    }); // start with devtools open

    mainWindow.webContents.openDevTools();
  }

  mainWindow.once("ready-to-show", function () {
    //OpenDefaultDocument(mainWindow, errorHandler);
    eventListeners.default.set();
    mainWindow.show();
    ipcMain.on("open-external-window", function (event, arg) {
      shell.openExternal(arg);
    });
  });
};

var generateMenu = function generateMenu() {
  var template = [{
    label: "File",
    submenu: [{
      label: "Open",
      click: function click() {
        OpenFile(errorHandler);
      }
    }, {
      role: "about"
    }, {
      role: "quit"
    }]
  }, {
    label: "Edit",
    submenu: [{
      role: "undo"
    }, {
      role: "redo"
    }, {
      type: "separator"
    }, {
      role: "cut"
    }, {
      role: "copy"
    }, {
      role: "paste"
    }, {
      role: "pasteandmatchstyle"
    }, {
      role: "delete"
    }, {
      role: "selectall"
    }]
  }, {
    label: "View",
    submenu: [{
      role: "reload"
    }, {
      role: "forcereload"
    }, {
      role: "toggledevtools"
    }, {
      type: "separator"
    }, {
      role: "resetzoom"
    }, {
      role: "zoomin"
    }, {
      role: "zoomout"
    }, {
      type: "separator"
    }, {
      role: "togglefullscreen"
    }]
  }, {
    role: "window",
    submenu: [{
      role: "minimize"
    }, {
      role: "close"
    }]
  }, {
    role: "help",
    submenu: [{
      click: function click() {
        require("electron").shell.openExternal("https://getstream.io/winds");
      },
      label: "Learn More"
    }, {
      click: function click() {
        require("electron").shell.openExternal("https://github.com/GetStream/Winds/issues");
      },
      label: "File Issue on GitHub"
    }]
  }];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

app.on("ready", function () {
  createWindow();
  generateMenu();
});
app.on("window-all-closed", function () {
  app.quit();
});
app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
ipcMain.on("load-page", function (event, arg) {
  mainWindow.loadURL(arg);
});