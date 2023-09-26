const { ipcRenderer, contextBridge } = require('electron');


contextBridge.exposeInMainWorld('api', {
    retrieveConfigFileAsJson: (args) => ipcRenderer.invoke('get-config-data', args),
    changeConfigFile: (args) => ipcRenderer.invoke('update-config-data', args),

    createNewXMLDocument: () => ipcRenderer.invoke('create-new-XML-file'),
    openExistingXMLDocument: () => ipcRenderer.invoke('open-existing-XML-file'),
    retrieveCurrentFilePath: () => ipcRenderer.invoke('get-current-file-path'),

    receiveCurrentPathFromMain: (callback) => ipcRenderer.on('return-path', callback),
    receiveRecordList: (callback) => ipcRenderer.on('return-record-list', callback),
    
    executeActionOnRecords: (action, record, exceptionCallback) => {
        const allowedMethods = ["append", "remove", "retrieve"]
        if (allowedMethods.includes(action)) {
            switch (action) {
                case "append":
                    ipcRenderer.send("append-new-record", record)
                    break
                case "remove":
                    ipcRenderer.send("remove-record", record)
                    break
                case "retrieve":
                    ipcRenderer.send("get-records")
                    break
                default:
                    exceptionCallback()
            }
        }
    },
    saveFile: (callback) => ipcRenderer.invoke('build-and-save', callback),
});