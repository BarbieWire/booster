const { ipcRenderer, contextBridge } = require('electron');


const filePathCallbacks = {
    retrieveCurrentFilePath: () => ipcRenderer.invoke('get-current-file-path'),
    receiveCurrentPathFromMain: (listener) => ipcRenderer.on('return-path', listener),
}

const configFileCallbacks = {
    retrieveConfigFileAsJson: (args) => ipcRenderer.invoke('get-config-data', args),
    changeConfigFile: (args) => ipcRenderer.invoke('update-config-data', args),
}

const xmlFileCallbacks = {
    createNewXMLDocument: () => ipcRenderer.invoke('create-new-XML-file'),
    openExistingXMLDocument: () => ipcRenderer.invoke('open-existing-XML-file'),
}

const recordsCallback = {
    mergeRecordsAndSave: () => ipcRenderer.invoke('merge-records-and-save'),
    receiveRecordList: (listener) => ipcRenderer.on('return-record-list', listener),
    executeActionOnRecords: (action, options, exceptionCallback) => {
        const allowedMethods = ["append", "remove", "retrieve", "update"]
        if (allowedMethods.includes(action)) {
            switch (action) {
                case "append":
                    ipcRenderer.send("append-new-record", options.name)
                    break
                case "remove":
                    ipcRenderer.send("remove-record", options.index)
                    break
                case "retrieve":
                    ipcRenderer.send("get-records")
                    break
                case "update":
                    ipcRenderer.send("update-record", options.index, options.record)
                    break
                default:
                    break
            }
        }
    }
}

contextBridge.exposeInMainWorld('api', {
    ...filePathCallbacks,
    ...configFileCallbacks,
    ...xmlFileCallbacks,
    ...recordsCallback,
    removeEventListener: (name, listener) => ipcRenderer.removeAllListeners(name, listener),
    displayMessageFromServer: (listener) => ipcRenderer.on("display-server-message", listener)
});