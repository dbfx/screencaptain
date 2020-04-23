module.exports = {
  init,
  onToggleAlwaysOnTop,
  onToggleFullScreen,
  onWindowBlur,
  onWindowFocus
}

var electron = require('electron')
var app = electron.app
var config = require('./config')
var menu

function init () {
  menu = electron.Menu.buildFromTemplate(getMenuTemplate())
  electron.Menu.setApplicationMenu(menu)
}

function onToggleAlwaysOnTop (flag) {
  getMenuItem('Float on Top').checked = flag
}

function onToggleFullScreen (flag) {
  getMenuItem('Full Screen').checked = flag
}

function onWindowBlur () {
  getMenuItem('Full Screen').enabled = false
  getMenuItem('Float on Top').enabled = false
}

function onWindowFocus () {
  getMenuItem('Full Screen').enabled = true
  getMenuItem('Float on Top').enabled = true
}

function getMenuItem (label) {
  for (var i = 0; i < menu.items.length; i++) {
    var menuItem = menu.items[i].submenu.items.find(function (item) {
      return item.label === label
    })
    if (menuItem) return menuItem
  }
}

function getMenuTemplate () {
  var template = [    
    {
      label: 'File',
      submenu: [        
        {
          label: process.platform === 'win32'
            ? 'Close'
            : 'Close Window',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: config.APP_NAME + ' Web',
          click: () => shell.openExternal(config.HOME_PAGE_URL)
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    
  }

  // On Windows and Linux, open dialogs do not support selecting both files and
  // folders and files, so add an extra menu item so there is one for each type.
  if (process.platform === 'linux' || process.platform === 'win32') {
    // Help menu (Windows, Linux)
    template[1].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'About ' + config.APP_NAME,
        click: () => windows.about.init()
      }
    )
  }
  // Add "File > Quit" menu item so Linux distros where the system tray icon is
  // missing will have a way to quit the app.
  if (process.platform === 'linux') {
    // File menu (Linux)
    template[0].submenu.push({
      label: 'Quit',
      click: () => app.quit()
    })
  }

  return template
}
