const { ipcMain } = require('electron');
const { XMLManager } = require('./XMLFileHandlers')

const store = require('./store')
const managerxml = new XMLManager()


function configCalls() {
    ipcMain.handle('get-config-data', (event, key) => {
        if (!key) {
            return store.get()
        }
        return store.get(key)
    })

    ipcMain.handle('update-config-data', (event, args) => {
        store.set(args.key, args.value)
        return args.value
    })
}


function XMLInteractioncalls() {
    ipcMain.handle('get-current-file-path', (event) => {
        return managerxml.filePath
    })

    ipcMain.handle('create-new-XML-file', (event) => {
        managerxml.createXMLFile(event)
    })

    ipcMain.handle('open-existing-XML-file', (event, args) => {
        try {
            managerxml.openXMLFile(event)
        } catch (err) {
            return "something went wrong"
        }
    })

    ipcMain.handle("build-and-save", ((event) => {
        const operationResult = managerxml.saveTofile()
        return operationResult
    }))

    ipcMain.on("append-new-record", (event, name) => {
        const data = managerxml.appendNewRecord(name)
        event.sender.send("return-record-list", data)
    });

    ipcMain.on("remove-record", (event, jsonObject) => {
        const data = managerxml.removeRecord(jsonObject)
        event.sender.send("return-record-list", data)
    });

    ipcMain.on("get-records", (event) => {
        const data = managerxml.getRecordList()
        event.sender.send("return-record-list", data)
    });

    ipcMain.on("update-record", (event, index, record) => {
        const data = managerxml.updateExistingRecord(record, index)
        event.sender.send("return-record-list", data)

        message = managerxml.validateObject(record)
        event.sender.send("display-server-message", message)
    });

    ipcMain.handle("merge-records-and-save", ((event) => {
        const data = managerxml.mergeTwofiles()
        event.sender.send("return-record-list", data)
    }))
    
}

module.exports = {
    configCalls, XMLInteractioncalls
}