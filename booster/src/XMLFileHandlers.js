const { dialog } = require('electron');

const path = require('path');
const fs = require('fs');
const util = require('util');

const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const store = require('./store')


class XMLFileReader {
    constructor() {
        this.openXMLFile = this.openXMLFile.bind(this)
        this.createXMLFile = this.createXMLFile.bind(this)
        this.XMLPrebuilt = `
            <products>
                <product>
                </product>
            </products>
        `
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

                fs.openSync(this.filePath, "w");
                fs.writeFileSync(this.filePath, this.XMLPrebuilt, err => {
                    if (err) console.error(err);
                    // file written successfully
                });
                this.readFile()
                e.sender.send('return-path', filePath);
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
}


class XMLManager extends XMLFileReader {
    constructor() {
        super()
        this.records = []
        this.filePath = ""
        this.options = {
            cdataPropName: "__cdata"
        }
        this.alwaysArray = [
            "products.product"
        ];

        this.readFile = this.readFile.bind(this)

        const path = store.get("previouslyOpenedFilePath")
        if (path && fs.existsSync(path)) {
            this.setFilePath(path)
            this.readFile()
        }
    }

    readFile() {
        if (this.lastReadFile !== this.filePath) {
            const result = fs.readFileSync(this.filePath, 'utf-8');
            const data = this.parseXMLContent(result)
            if (data.products.product[0] === "") {
                data.products.product = []
            }
            
            this.jsonObj = data
            this.records = data.products.product
            this.lastReadFile = this.filePath
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

    setFilePath(filePath) {
        this.filePath = filePath
    }

    getRecordList() {
        return this.records
    }
    

    // receives from front-end new object and replaces existing with modified 
    updateExistingRecord(updatedRecord) {

    }

    appendNewRecord(jsonObject) {
        this.records.push(jsonObject)
        this.saveTofile()
        return this.getRecordList()
    }

    removeRecord(recordTodelete) {
        const elementIndex = this.records.findIndex((element) => element.id === recordTodelete.id)
        this.records.splice(elementIndex, 1)
        this.saveTofile()

        this.records[0] === "" ? this.records = [] : null
        return this.getRecordList()
    }
    
    // receives a path of file which it merges with from handler  
    // opens the file and writes current records to the file
    mergeTwofiles() {
        
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
        const parsedData = parser.parse(xmlDataStr);
        // console.log(util.inspect(this.jsonObj, { depth: Infinity }))
        return parsedData
    }
}

module.exports = {
    XMLManager
}