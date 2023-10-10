const Store = require('electron-store');

const schema = {
    chatGPTApiKey: {
        type: 'string',
        default: ''
    },

    GoogleCX: {
        type: 'string',
        default: ''
    },
    GoogleApiKey: {
        type: 'string',
        default: ''
    },

    cloudinaryApiKey: {
        type: 'string',
        default: ''
    },
    cloudinaryApiSecret: {
        type: 'string',
        default: ''
    },
    cloudinaryCloudName: {
        type: 'string',
        default: ''
    }
};

const store = new Store({schema});

module.exports = store;