const { ipcMain } = require('electron');
const { XMLManager } = require('../utils/XMLFileHandlers')
const { ServerMessage } = require('../utils/ServerMessage')

const { getAllRecords, updateRecords } = require('../database/main')

const { ProcessImageManager } = require('../external/cloudinaryAPI')

const manager = new XMLManager()


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
            const result = manager.saveFile(recordList)
            if (result === "records saved") {
                const message = new ServerMessage("Records have been successfully saved", "save-records", "success")
                event.sender.send("display-server-message", message)
            }
        } catch (e) {
            const message = new ServerMessage("Error occured saving records", "save-records", "failure")
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
            const cloudinary = new ProcessImageManager()
            const data = await cloudinary.getImageURL()
            return data
        } catch (e) {
            const message = new ServerMessage(e.message, "upload-image", "failure")
            event.sender.send("display-server-message", message)
        }
    })

    ipcMain.handle('convert-image', async (event, url) => {
        try {
            const cloudinary = new ProcessImageManager()
            const data = await cloudinary.convertImage(url)
            return data
        } catch (e) {
            const message = new ServerMessage(e.message, "convert-image", "failure")
            event.sender.send("display-server-message", message)
        }
    })
}

function databaseAPICalls() {
    ipcMain.handle('getAllRecords', async (event, tableName) => {
        try {
            // Call the getAllRecords function with the specified table name
            const response = await getAllRecords(tableName);
            return response
        } catch (e) {
            const message = new ServerMessage(e.message, "get-all-records", "failure")
            event.sender.send("display-server-message", message)
        }
    })

    ipcMain.handle('update-records', async (event, tableName, data = []) => {
        // data array suppose to look like this: [{name: "key", newValue: "value"}, ...]
        try {
            await updateRecords(tableName, "value", data)
            return { "updated": true }
        } catch (e) {
            const message = new ServerMessage(e.message, "update-records", "failure")
            event.sender.send("display-server-message", message)
        }
    })
}


module.exports = {
    ImageAPICalls,
    XMLInteractionCalls,
    fileInteractionCalls,
    databaseAPICalls,
}