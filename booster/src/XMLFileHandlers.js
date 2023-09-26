const { dialog } = require('electron');

const path = require('path');
const fs = require('fs');
const util = require('util');

const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const store = require('./store')


class XMLManager {
    constructor() {    
        this.openXMLFile = this.openXMLFile.bind(this)
        this.readFile = this.readFile.bind(this)
        this.createXMLFile = this.createXMLFile.bind(this)

        let rawdata = fs.readFileSync(path.join(__dirname, 'template.json'));
        this.template = JSON.parse(rawdata);

        this.XMLPrebuilt = `
            <products>
                <product>
                </product>
            </products>
        `

        this.options = {
            cdataPropName: "__cdata"
        }

        this.alwaysArray = [
            "products.product"
        ];

        this.filePath = ""
        if (store.get("previouslyOpenedFilePath")) {
            this.setFilePath(store.get("previouslyOpenedFilePath"))
            this.readFile()
        }

        this.records = []
    }

    getRecordList() {
        return this.records
    }

    appendNewRecord(jsonObject) {
        this.records.push(jsonObject)
        return this.getRecordList()
    }

    removeRecord(recordTodelete) {
        const elementIndex = this.records.findIndex((element) => element.id === recordTodelete.id)
        this.records.pop(elementIndex)
        return this.getRecordList()
    }

    buildXMLContent() {
        if (this.records.length === 0) {
            this.records.push("")
        }
        const builder = new XMLBuilder(this.options);
        const xmlOutput = builder.build(this.jsonObj);
        
        return xmlOutput
    }

    parseXMLContent(xmlDataStr) {
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
        const data = parser.parse(xmlDataStr);

        if (data.products.product.every(item => item === "")) {
            data.products.product = []
        }
        
        this.jsonObj = data
        this.records = data.products.product
        this.lastReadFile = this.filePath

        // console.log(util.inspect(this.jsonObj, { depth: Infinity }))
    }

    readFile() {
        if (this.lastReadFile !== this.filePath) {
            const result = fs.readFileSync(this.filePath, 'utf-8');
            this.parseXMLContent(result)

            console.log(this.filePath)
        }
        return this.records
    }

    saveTofile() {
        const XMLString = this.buildXMLContent()
        try {
            fs.writeFileSync(this.filePath, XMLString, 'utf-8');
            return "success"
        } catch (e) {
            console.log(e)
            return "failed to save records"
        }
    }

    createXMLFile(e) {
        // Resolves to a Promise<Object>
        dialog.showSaveDialog({
            title: 'Select file to override or create a new one',
            buttonLabel: 'Proceed',
            filters: [
                {
                    name: '.xml',
                    extensions: ['xml']
                },
            ],
            properties: []
        }).then(result => {
            if (!result.canceled) {
                const filePath = result.filePath;
                this.setFilePath(filePath)

                fs.openSync(filePath, "w");
                fs.writeFileSync(filePath, this.XMLPrebuilt, err => {
                    if (err) console.error(err);
                    // file written successfully
                });

                e.sender.send('return-path', filePath);
                this.readFile()
                store.set("previouslyOpenedFilePath", filePath)
            }
        }).catch(err => {
            console.log(err)
        });
    }

    async openXMLFile(e) {
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
                this.setFilePath(filePath)
                // read records from the file
                this.readFile()
                store.set("previouslyOpenedFilePath", filePath)

                e.sender.send('return-path', filePath)
            }
        }).catch((err) => {
            console.error('Error opening file dialog:', err);
        });
    }

    setFilePath(filePath) {
        this.filePath = filePath
    }
}

module.exports = {
    XMLManager
}