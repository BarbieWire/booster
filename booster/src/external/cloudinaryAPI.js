const cloudinary = require('cloudinary').v2;

const { dialog } = require('electron');

const { getRecordByName } = require('../database/main')


// Return "https" URLs by setting secure: true
class ProcessImageManager {
    constructor() {
        this.imageArray = []
        this.initialize()
    }

    async getKeys(name) {
        const record = await getRecordByName("sensitive", name)
        return record.value
    }

    async initialize() {
        cloudinary.config({
            secure: true,
            cloud_name: await this.getKeys("cloudinaryCloudName"),
            api_key: await this.getKeys("cloudinaryApiKey"),
            api_secret: await this.getKeys("cloudinaryApiSecret")
        });
    }

    async uploadImage(imagePath) {
        // Use the uploaded file's name as the asset's public ID and 
        // allow overwriting the asset with new versions
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            format: "jpg"
        };

        try {
            // Upload the image
            const result = await cloudinary.uploader.upload(imagePath, options);
            return result
        } catch (error) {
            return error
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
                if (result?.name === "Error") {
                    throw result
                }
                links.push(result)
            }
            return links
        }
    }

    async convertImage(imageUrl) {
        const data = await this.uploadImage(imageUrl);
        if (data?.name === "Error") {
            throw data
        }
        return data
    }
}

module.exports = {
    ProcessImageManager
}
