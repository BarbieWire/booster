const { app, BrowserWindow } = require('electron');
const path = require('path');

const {
    createTable,
    populateTable,
    updateRecords,
    db
} = require('../database/main')

const {
    XMLInteractionCalls,
    fileInteractionCalls,
    ImageAPICalls,
    databaseAPICalls
} = require('./handlers')


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
        if (mode.current === "development") mainWindow.webContents.openDevTools();
    });
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    const tableName = "sensitive"
    createTable(tableName)

    const records = [
        { name: 'chatGPTApiKey' },
        { name: 'GoogleCX' },
        { name: 'GoogleApiKey' },
        { name: 'cloudinaryApiKey' },
        { name: 'cloudinaryApiSecret' },
        { name: 'cloudinaryCloudName' },
    ];
    populateTable(tableName, records)
    // example of record updating process
    // updateRecords( tableName, 'value', [{id: 1, newValue: '123'}]) 

    const tableName2 = 'gears'
    createTable(tableName2)
    const gears = [{ name: "previousFile" }]
    populateTable(tableName2, gears)

    // Close the database connection when the app quits
    app.on('will-quit', () => {
        db.close((err) => {
            if (err) {
                console.error('Error closing database: ' + err.message);
            } else {
                console.log('Database connection closed');
            }
        });
    });

})

app.whenReady().then(() => {
    // handlers
    databaseAPICalls()
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