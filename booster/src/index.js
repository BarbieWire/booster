const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

const { configCalls, XMLInteractionCalls, fileInteractionCalls, ImageAPICalls } = require('./handlers')

const mode = {
    current: "development"
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minHeight: 800,
        minWidth: 1200,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.setMenuBarVisibility(false)

    // how to display based on mode
    mode.current === "development"
        ? mainWindow.loadURL("http://localhost:3000/")
        : mainWindow.loadFile(path.join(__dirname, "build/index.html"));

    mainWindow.on("ready-to-show", () => {
        mainWindow.webContents.openDevTools();
    });
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // handlers 
    configCalls()
    fileInteractionCalls()
    XMLInteractionCalls()
    ImageAPICalls()
    
    // create main window 
    createWindow()
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

