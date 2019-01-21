// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const {
  con,
  getTransactionsByMonth,
  getBudgetByMonth,
  getAllCategories,
  updateTransactionCategory,
  createBudgetCategory,
  getSpendingByMonth,
} = require('./mainProcess/database');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1000, height: 800})

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:3000');

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  ipcMain.on('fetch-transactions', (event, data) => {
    getTransactionsByMonth(data, (err, transactions) => {
      event.sender.send('send-transactions', { ...data, transactions });
    })
  });

  ipcMain.on('fetch-budget', (event, data) => {
    getBudgetByMonth(data, (err, budget) => {
      event.sender.send('send-budget', { ...data, budget});
    });
  });

  ipcMain.on('fetch-categories', (event, data) => {
    getAllCategories(data, (err, categories) => {
      event.sender.send('send-categories', { ...data, categories })
    })
  })

  ipcMain.on('set-transaction-category', (event, data) => {
    updateTransactionCategory(data, (err, data) => {
      if (err) {
        event.sender.send('set-transaction-category-err', { ...data, err})
      }
    })
  });

  ipcMain.on('create-budget-category', (event, data) => {
    createBudgetCategory(data, (err, data) => {
      console.log('callback!', err, data);
      if (err) {
        event.sender.send('set-transaction-category-err', { ...data, err});
      } else {
        console.log('sending event');
        event.sender.send('new-budget-category');
      }
    })
  });

  ipcMain.on('fetch-spending-status', (event, { month }) => {
    getSpendingByMonth({ month }, (err, data) => {
      console.log('call back!', err, data);
      event.sender.send('send-spending-status', { month, spending: data });
    })
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    con.end();
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
