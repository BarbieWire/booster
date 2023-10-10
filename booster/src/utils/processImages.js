const cloudinary = require('cloudinary').v2;
const store = require('../sensitiveData/store')

const { ServerMessage } = require('./ServerMessage')

const { dialog } = require('electron');


// Return "https" URLs by setting secure: true
class ProcessImageManager {
    constructor() {
        this.imageArray = []

        cloudinary.config({
            secure: true,
            cloud_name: store.get("cloudinaryCloudName"),
            api_key: store.get("cloudinaryApiKey"),
            api_secret: store.get("cloudinaryApiSecret")
        });
    }

    async uploadImage(imagePath) {
        // Use the uploaded file's name as the asset's public ID and 
        // allow overwriting the asset with new versions
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };

        try {
            // Upload the image
            const result = await cloudinary.uploader.upload(imagePath, options);
            return result.url
        } catch (error) {
            console.log(error);
        }
    };

    async openImageInstances() {
        // Show an "Open File" dialog
        const result = await dialog.showOpenDialog({
            title: 'Select images',
            properties: ['openFile', 'multiSelections'], // Specify that you want to open a single file
            filters: [
                { name: 'Images', extensions: ['jpeg', 'png', 'jpg'] }, // Customize file filters
            ],
        })
        return result
    }

    async getImageURL() {
        const imageArray = (await this.openImageInstances()).filePaths
        if (imageArray.length) {
            const links = []

            for (const image of imageArray) {
                // Upload the image
                const result = await this.uploadImage(image);
                links.push(result)
            }
            return links 
        }
    };
}

module.exports = {
    ProcessImageManager
}
