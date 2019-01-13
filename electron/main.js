const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  TouchBar,
  globalShortcut
} = require("electron");

const { TouchBarButton, TouchBarLabel, TouchBarSpacer } = TouchBar;
const { OpenFile, OpenDefaultDocument } = require("./services/fileStore");
const eventListeners = require("./services/eventListeners");
const EventTriggers = require("./services/eventTriggers").EventTriggers;

const path = require("path");
const isDev = require("electron-is-dev");

const errorHandler = error => {
  console.log("!!! ERROR: ", error);
};

let mainWindow;
let triggers;

const createWindow = () => {
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
    width: 1280,
    icon: path.join(__dirname, "assets/icons/png/64x64.png")
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = require("electron-devtools-installer");

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log("An error occurred: ", err);
      });

    installExtension(REDUX_DEVTOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log("An error occurred: ", err);
      });
    // start with devtools open
    mainWindow.webContents.openDevTools();
  }

  mainWindow.once("ready-to-show", () => {
    //OpenDefaultDocument(mainWindow, errorHandler);
    eventListeners.default.set();
    mainWindow.show();

    ipcMain.on("open-external-window", (event, arg) => {
      shell.openExternal(arg);
    });
  });

  triggers = new EventTriggers(mainWindow, errorHandler);
};

const shortcuts = [
  {
    label: "Open",
    accelerator: "CmdOrCtrl+o",
    callback: () => {
      OpenFile((err, doc) => {
        if (err) errorHandler(err);
        else triggers.OpenNewDocument(doc);
      });
    }
  },
  {
    label: "Save",
    accelerator: "CmdOrCtrl+s",
    callback: () => {
      triggers.RequestFocusedDocument();
    }
  },
  {
    label: "Open Start Document",
    accelerator: "CmdOrCtrl+d",
    callback: () => {
      OpenDefaultDocument((err, doc) => {
        if (err) errorHandler(err);
        else triggers.OpenNewDocument(doc);
      });
    }
  }
];

const generateMenu = () => {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New File",
          click: () => {
            console.log("open new file");
          }
        },
        { type: "separator" },
        {
          label: "Open",
          accelerator: "CmdOrCtrl+o",
          click: () => {
            OpenFile((err, doc) => {
              if (err) errorHandler(err);
              else triggers.OpenNewDocument(doc);
            });
          }
        },
        {
          label: "Open Start Document",
          accelerator: "CmdOrCtrl+d",
          click: () => {
            OpenDefaultDocument((err, doc) => {
              if (err) errorHandler(err);
              else triggers.OpenNewDocument(doc);
            });
          }
        },
        { type: "separator" },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+s",
          click: () => {
            triggers.RequestFocusedDocument();
          }
        },
        {
          label: "Save As",
          click: () => {
            console.log("save file As");
          }
        },
        {
          label: "Save All",
          click: () => {
            console.log("save all files");
          }
        },
        { type: "separator" },
        { role: "about" },
        { role: "quit" }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteandmatchstyle" },
        { role: "delete" },
        { role: "selectall" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      role: "window",
      submenu: [{ role: "minimize" }, { role: "close" }]
    },
    {
      role: "help",
      submenu: [
        {
          click() {
            require("electron").shell.openExternal(
              "https://getstream.io/winds"
            );
          },
          label: "Learn More"
        },
        {
          click() {
            require("electron").shell.openExternal(
              "https://github.com/GetStream/Winds/issues"
            );
          },
          label: "File Issue on GitHub"
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

app.on("ready", () => {
  createWindow();
  generateMenu();
  shortcuts.forEach(elem => {
    globalShortcut.register(elem.accelerator, elem.callback);
  });
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("load-page", (event, arg) => {
  mainWindow.loadURL(arg);
});
