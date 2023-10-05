const { dialog } = require('electron');

const path = require('path');
const fs = require('fs');
const util = require('util');
const _ = require('lodash')

const Ajv = require('ajv');

const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const store = require('./store')

const recordTemplate = require('./RecordTemplate.json')

const {schema} = require('./recordSchema')


class XMLFileReader {
    constructor() {
        this.openXMLFile = this.openXMLFile.bind(this)
        this.createXMLFile = this.createXMLFile.bind(this)
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
                this.setFilePath(result.filePath)
                fs.openSync(this.filePath, "w");
                this.readFile()

                e.sender.send('return-path', this.filePath);
                store.set("previouslyOpenedFilePath", this.filePath)
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
                this.setFilePath(result.filePaths[0])
                this.readFile()

                store.set("previouslyOpenedFilePath", this.filePath)
                e.sender.send('return-path', this.filePath)
            }
        }).catch((err) => {
            console.error('Error opening file dialog:', err);
        });
    }
}

class XMLManager extends XMLFileReader {
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

        const prevPath = store.get("previouslyOpenedFilePath")
        if (prevPath && fs.existsSync(prevPath)) {
            this.filePath = prevPath
            this.readFile()
        }
    }

    readFile() {
        if (this.lastReadFile !== this.filePath) {
            const result = fs.readFileSync(this.filePath, 'utf-8');
            const parsedXMLString = this.#parseXMLContent(result)

            if (!_.isEmpty(parsedXMLString)) {
                this.records = parsedXMLString.products.product
            } else {
                this.records = []
            }

            this.lastReadFile = this.filePath
        }
        return this.records
    }

    #saveTofile() {
        let XMLString = this.#buildXMLContent()
        if (XMLString) {
            XMLString = `<products>${XMLString}</products>`
        }

        try {
            fs.writeFileSync(this.filePath, XMLString, 'utf-8');
            return "success"
        } catch (e) {
            return "failed to save records"
        }
    }

    validateObject(data) {
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(data);

        const template = {message: "", error: ""}

        if (!valid) {
            template.message = "some fields are missing, saved as draft"
            template.error = validate.errors
            return template
        } 
        template.message = "successfully saved"
        return template
    }

    // receives from front-end new object and replaces existing with modified 
    updateExistingRecord(updatedRecord, index) {
        this.records[index] = updatedRecord
        this.#saveTofile()

        return this.getRecordList()
    }

    appendNewRecord(name) {
        const record = _.cloneDeep(recordTemplate)
        record["title-ru"].__cdata = name
        this.records.push(record)

        return this.getRecordList()
    }

    removeRecord(index) {
        this.records.splice(index, 1)
        this.#saveTofile()
        return this.getRecordList()
    }


    #buildXMLContent() {
        const builder = new XMLBuilder(this.options);
        const xmlOutput = builder.build(this.records);
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
    mergeTwofiles() {
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
                // read records from the file
                const res = fs.readFileSync(filePath, 'utf-8');
                let parsedXMLString = this.#parseXMLContent(res)
                if (!_.isEmpty(parsedXMLString)) {
                    this.records.push(...parsedXMLString.products.product)
                }
                this.#saveTofile()
            }
        }).catch((err) => {
            console.error('Error opening file dialog:', err);
        });
    }

    setFilePath(filePath) {
        this.filePath = filePath
    }

    getRecordList() {
        return this.records
    }
}

module.exports = {
    XMLManager
}