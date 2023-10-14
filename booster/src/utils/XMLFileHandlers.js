const { dialog } = require('electron');

const path = require('path');
const fs = require('fs');
const util = require('util');
const _ = require('lodash')
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

const store = require('../sensitiveData/store')


class FileManager {
    constructor() {
        this.openXMLFile = this.openXMLFile.bind(this)
        this.createXMLFile = this.createXMLFile.bind(this)
    }

    async createXMLFile() {
        // Resolves to a Promise<Object>
        const result = await dialog.showSaveDialog({
            title: 'Select file to override or create a new one',
            buttonLabel: 'Proceed',
            filters: [
                {
                    name: '.xml',
                    extensions: ['xml']
                },
            ],
            properties: []
        })
        if (!result.canceled) {
            this.setFilePath(result.filePath)
            store.set("previouslyOpenedFilePath", this.filePath)

            fs.openSync(this.filePath, "w");
        }
        return this.getFilePath()
    }

    async openXMLFile() {
        // Show an "Open File" dialog
        const result = await dialog.showOpenDialog({
            title: 'Open File',
            properties: ['openFile'], // Specify that you want to open a single file
            filters: [
                { name: 'XML Files', extensions: ['xml'] }, // Customize file filters
            ],
        })

        if (!result.canceled) {
            this.setFilePath(result.filePaths[0])
            store.set("previouslyOpenedFilePath", this.filePath)
        }
        return this.getFilePath()
    }

    setFilePath(filePath) {
        this.filePath = filePath
    }

    getFilePath() {
        return this.filePath
    }
}


class XMLManager extends FileManager {
    constructor() {
        super()
        
        this.filePath = ""
        this.options = {
            cdataPropName: "__cdata",
            arrayNodeName: "product"
        }
        this.alwaysArray = [
            "products.product",
            "products.product.colours.colour.modifications.modification",
            "products.product.colours.colour.images.image",
            "products.product.properties.property"
        ];

        const path = store.get("previouslyOpenedFilePath")
        if (path && fs.existsSync(path)) this.filePath = path
    }


    readFile(path = this.filePath) {
        if (path && fs.existsSync(path)) {
            const result = fs.readFileSync(path, 'utf-8');
            const parsedXMLString = this.#parseXMLContent(result)

            if (!_.isEmpty(parsedXMLString)) {
                return parsedXMLString.products.product
            }
            return []
        }

        if (!fs.existsSync(path)) {
            store.set("previouslyOpenedFilePath", "")
        }

        throw "No file selected or file was deleted"
    }

    saveFile(recordList, path = this.filePath) {
        let XMLString = this.#buildXMLContent(recordList)
        if (XMLString) {
            XMLString = `<products>${XMLString}</products>`
        }

        fs.writeFileSync(path, XMLString, 'utf-8');
        return "records saved"
    }

    #buildXMLContent(recordList) {
        const builder = new XMLBuilder(this.options);
        const xmlOutput = builder.build(recordList);
        return xmlOutput
    }

    #parseXMLContent(xmlDataStr) {
        const options = {
            ...this.options,
            ignoreAttributes: false,
            //name: is either tagname, or attribute name
            //jPath: upto the tag name
            isArray: (name, jpath, isLeafNode, isAttribute) => {
                if (this.alwaysArray.indexOf(jpath) !== -1) return true;
            }
        };

        const parser = new XMLParser(options);
        const parsedData = parser.parse(xmlDataStr);
        return parsedData
    }

    // receives a path of file which it merges with from handler  
    // opens the file and writes current records to the file
    async mergeTwofiles() {
        // Show an "Open File" dialog
        dialog.showOpenDialog({
            title: 'Open File',
            properties: ['openFile'], // Specify that you want to open a single file
            filters: [
                { name: 'XML Files', extensions: ['xml'] }, // Customize file filters
            ],
        }).then((result) => {
            if (!result.canceled) {
                const filePath = result.filePaths[0];
                // read records from the files
                const loadedRecords = this.readFile(filePath)
                const currentRecords = this.readFile()

                const newRecordList = [...loadedRecords, ...currentRecords]
                this.saveFile(newRecordList, filePath)
            }
        }).catch((err) => {
            console.error('Error opening file dialog:', err);
        });
    }
}

module.exports = {
    XMLManager
}