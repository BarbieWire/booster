const { ipcMain } = require('electron');
const { XMLManager } = require('./utils/XMLFileHandlers')
const { ServerMessage } = require('./utils/ServerMessage')

const { ProcessImageManager } = require('./utils/processImages')

const store = require('./sensitiveData/store')
const manager = new XMLManager()
const cloudinary = new ProcessImageManager()



function configCalls() {
    ipcMain.handle('get-config-data', (_, key) => {
        if (!key) return store.get()
        return store.get(key)
    })

    ipcMain.handle('update-config-data', (event, configObject) => {
        for (const [key, value] of Object.entries(configObject)) {
            store.set(key, value)
        }
        const message = new ServerMessage("Config updated", "update-config", "success")
        event.sender.send("display-server-message", message)
    })
}


function fileInteractionCalls() {
    ipcMain.handle('create-new-XML-file', async (event) => {
        try {
            const filePath = await manager.createXMLFile()

            event.sender.send('return-path', filePath);

            const message = new ServerMessage("File created", "create-new-XML", "success")
            event.sender.send("display-server-message", message)
        } catch {
            const message = new ServerMessage("Something went wrong creating the file", "create-new-XML", "success")
            event.sender.send("display-server-message", message)
        }

    })

    ipcMain.handle('open-existing-XML-file', async (event) => {
        // always receives event MANDATORY
        try {
            const filePath = await manager.openXMLFile()
            event.sender.send('return-path', filePath)

            const message = new ServerMessage("File opened", "open-existing-XML", "success")
            event.sender.send("display-server-message", message)
        } catch {
            const message = new ServerMessage("Something went wrong opening the file", "open-existing-XML", "failure")
            event.sender.send("display-server-message", message)
        }
    })
}


function XMLInteractionCalls() {
    // returns current opende file
    ipcMain.handle('get-current-file-path', () => {
        return manager.getFilePath()
    })

    // receives a valid record list and ssaves all records to xml file
    ipcMain.handle("save-records", ((event, recordList) => {
        try {
            manager.saveFile(recordList)
        } catch (e) {
            const message = new ServerMessage("error occured saving records", "save-records", "failure")
            event.sender.send("display-server-message", message)
        }
    }))

    // application initially send a request to parse records from chosen file
    ipcMain.handle("get-records", (event) => {
        try {
            const records = manager.readFile()
            return records
        } catch (e) {
            const message = new ServerMessage("error occured retrieving records", "get-records", "failure")
            event.sender.send("display-server-message", message)
        }
    });

    // handles record merging
    ipcMain.handle("merge-records", (() => manager.mergeTwofiles()))
}


function ImageAPICalls() {
    ipcMain.handle('upload-image', async (event) => {
        try {
            const data = await cloudinary.getImageURL()
            return data
        } catch (e) {
            const message = new ServerMessage(e.message, "upload-image", "failure")
            event.sender.send("display-server-message", message)
        }
    })

    ipcMain.handle('convert-image', async (event, url) => {
        try {
            const data = await cloudinary.convertImage(url)
            return data
        } catch (e) {
            const message = new ServerMessage(e.message, "convert-image", "failure")
            event.sender.send("display-server-message", message)
        }
    })
}


module.exports = {
    ImageAPICalls,
    configCalls,
    XMLInteractionCalls,
    fileInteractionCalls,
}