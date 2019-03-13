// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const {
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

  ipcMain.on('fetch-transactions', (event, sentData) => {
    getTransactionsByMonth(sentData, (err, transactions) => {
      if (err) {
        console.log(err)
        event.sender.send('fetch-data-err', { err, sentData });
      } else {
        event.sender.send('send-transactions', { ...sentData, transactions });
      }
    })
  });

  ipcMain.on('fetch-budget', (event, sentData) => {
    getBudgetByMonth(sentData, (err, budget) => {
      if (err) {
        console.log(err)
        event.sender.send('fetch-data-err', { err, sentData });
      } else {
        event.sender.send('send-budget', { ...sentData, budget });
      }
    });
  });

  ipcMain.on('fetch-categories', (event, sentData) => {
    getAllCategories(sentData, (err, categories) => {
      if (err) {
        console.log(err)
        event.sender.send('fetch-data-err', { err, sentData });
      } else {
        event.sender.send('send-categories', { ...sentData, categories });
      }
    });
  });

  ipcMain.on('fetch-spending-status', (event, sentData) => {
    getSpendingByMonth({ ...sentData }, (err, spending) => {
      if (err) {
        console.log(err)
        event.sender.send('fetch-data-err', { err, sentData });
      } else {
        event.sender.send('send-spending-status', { ...sentData, spending });
      }
    });
  });

  ipcMain.on('set-transaction-category', (event, sentData) => {
    updateTransactionCategory(sentData, (err, data) => {
      if (err) {
        console.log(err)
        event.sender.send('transaction-update-err', { ...sentData, err });
      } else {
        event.sender.send('transaction-update-success', { ...sentData, ...data });
      }
    });
  });

  ipcMain.on('create-budget-category', (event, sentData) => {
    createBudgetCategory(sentData, (err, data) => {
      console.log('callback!', err, data);
      if (err) {
        console.log(err)
        event.sender.send('budget-update-err', { ...sentData, err });
      } else {
        event.sender.send('budget-update-success', { ...sentData });
      }
    })
  });

  ipcMain.on('set-ignore-value', (event, sentData) => {
    console.log(sentData)
    updateTransactionCategory(sentData, (err, data) => {
      if (err) {
        console.log(err)
        event.sender.send('transaction-update-err', { ...sentData, err });
      }
    })
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    // con.end();
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
