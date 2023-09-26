const { dialog } = require('electron');
const fs = require('fs');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const util = require('util');
const path = require('path');

const store = require('./store')


class XMLManager {
    constructor() {    
        this.openXMLFile = this.openXMLFile.bind(this)
        this.saveXML = this.saveXML.bind(this)

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
    }

    appendNewRecord(jsonObject) {
        this.records.push(jsonObject)
        return this.records
    }

    removeRecord(jsonObject) {
        this.records = this.records.filter((record) => {
            return record.id !== jsonObject.id
        })

        return this.records
    }

    buildXMLContent() {
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

        if (!data.products.product.every(item => item === "")) {
            const processedForFrontend = data.products.product.map((originalObject, index) => ({
                id: index + 1,
                product: originalObject
            }));

            data.products.product = processedForFrontend
        } else {
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
        }
        return this.records
    }

    saveXML(XMLString) {
        const fs = require('fs');
        try {
            fs.writeFileSync(this.filePath, XMLString, 'utf-8');
            console.log("saved!")
        } catch (e) {
            console.log(e)
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
                fs.writeFile(filePath, this.XMLPrebuilt, err => {
                    if (err) console.error(err);
                    e.sender.send('return-path', filePath);
                    // file written successfully
                });
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
                this.readFile(filePath)
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