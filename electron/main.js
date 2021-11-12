const path = require('path');

const { app, BrowserWindow, ipcMain } = require('electron');
const remoteMain = require('@electron/remote/main');
const isDev = require('electron-is-dev');

remoteMain.initialize()


function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 900,
        height: 600,
        minHeight: 400,
        minWidth: 590,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });



    remoteMain.enable(win.webContents);

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/react/index.html')}`
    );
    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });
    }

    require("./menu.js")(win);

    ipcMain.on('get-open-files', (event, arg) => {
        win.webContents.send('open-files', "bruh");
    })
}





// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
});

app.on('open-file', (event, path) => {
    require("fs").writeFileSync("/tmp/ampene-openwith", JSON.stringify({
        path
    }));
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
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