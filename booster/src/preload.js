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

const recordsCallbacks = {
    getRecordList: () => ipcRenderer.invoke('get-records'),
    saveRecordList: (recordList) => ipcRenderer.invoke('save-records', recordList),

    mergeRecords: () => ipcRenderer.invoke('merge-records'),
}

const imageProcessingCallbacks = {
    generateImageUrl: () => ipcRenderer.invoke('upload-image')
}

contextBridge.exposeInMainWorld('api', {
    ...filePathCallbacks,
    ...configFileCallbacks,
    ...xmlFileCallbacks,
    ...recordsCallbacks,

    ...imageProcessingCallbacks, 
    
    removeEventListener: (name, listener) => ipcRenderer.removeAllListeners(name, listener),
    displayMessageFromServer: (listener) => ipcRenderer.on('display-server-message', listener)
});