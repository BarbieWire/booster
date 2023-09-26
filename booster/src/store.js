const Store = require('electron-store');

const schema = {
    chatGPTApiKey: {
        type: 'string',
        default: ''
    },
    
};

const store = new Store({schema});

module.exports = store;