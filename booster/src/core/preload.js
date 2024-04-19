const { ipcRenderer, contextBridge } = require('electron');

const configFileCallbacks = {
    retrieveConfigFileAsJson: args => ipcRenderer.invoke('get-config-data', args),
    changeConfigFile: args => ipcRenderer.invoke('update-config-data', args),
}

const xmlFileCallbacks = {
    createNewXMLDocument: () => ipcRenderer.invoke('create-new-XML-file'),
    openExistingXMLDocument: () => ipcRenderer.invoke('open-existing-XML-file'),
}

const recordsCallbacks = {
    getRecordList: () => ipcRenderer.invoke('get-records'),
    saveRecordList: (recordList) => ipcRenderer.invoke('save-records', recordList),

    mergeRecords: () => ipcRenderer.invoke('merge-records'),
}

const imageProcessingCallbacks = {
    generateImageUrl: () => ipcRenderer.invoke('upload-image'),
    uploadToServer: imageURL => ipcRenderer.invoke('convert-image', imageURL)
}

const DatabaseCallbacks = {
    getAllTableRecords: tableName => ipcRenderer.invoke('getAllRecords', tableName),
    currentFilePathResponse: listener => ipcRenderer.on('return-path', listener),
    updateRecords: (tableName, data) => ipcRenderer.invoke('update-records', tableName, data)
}


contextBridge.exposeInMainWorld('api', {
    ...configFileCallbacks,
    ...xmlFileCallbacks,
    ...recordsCallbacks,
    ...imageProcessingCallbacks,
    ...DatabaseCallbacks,
    
    removeEventListener: (name, listener) => ipcRenderer.removeAllListeners(name, listener),
    displayMessageFromServer: (listener) => ipcRenderer.on('display-server-message', listener)
});