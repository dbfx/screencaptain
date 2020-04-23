const { app, BrowserWindow } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 950,
    frame: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
    },
    backgroundColor: '#282c34',
    icon: __dirname + "/images/square.png"
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  menu.init()
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

var config = require('./config')
var menu = require('./menu')
